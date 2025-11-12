import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';
import { dockerSandbox } from '@/lib/docker';
import { sessionService } from '@/lib/session';
import { randomBytes } from 'crypto';

const execAsync = promisify(exec);

// Enable Docker sandboxing by default (can be disabled via env var)
const USE_DOCKER_SANDBOX = process.env.USE_DOCKER_SANDBOX !== 'false';

export const dynamic = 'force-dynamic';

interface TerminalRequest {
  command: string;
  cwd?: string;
  sessionId?: string;
}

interface TerminalResponse {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
  cwd: string;
  sessionId?: string;
}

// Security: Commands that require local execution
const LOCAL_ONLY_COMMANDS = [
  // System administration
  'sudo', 'su', 'rm -rf', 'dd', 'mkfs', 'fdisk', 'format',
  'shutdown', 'reboot', 'halt', 'poweroff', 'init 0', 'init 6',
  'chmod', 'chown', 'chgrp', 'passwd', 'useradd', 'userdel',
  'killall', 'kill', 'pkill', 'xkill', 'systemctl', 'service',
  // File system operations
  'mount', 'umount', 'fsck', 'badblocks', 'e2fsck',
  // Network administration
  'ifconfig', 'ip', 'iptables', 'ufw', 'netstat', 'ss',
  // Process management
  'top', 'htop', 'ps aux', 'kill -9', 'renice', 'nice',
  // Development tools that need local access
  'docker', 'docker-compose', 'kubectl', 'helm', 'terraform',
  'vagrant', 'virtualbox', 'vmware', 'parallels'
];

// Security: Commands safe for remote execution
const REMOTE_SAFE_COMMANDS = [
  // File operations
  'ls', 'pwd', 'cd', 'cat', 'head', 'tail', 'grep', 'find', 'mkdir', 'rmdir', 'touch', 'cp', 'mv',
  // Git operations
  'git', 'git status', 'git add', 'git commit', 'git push', 'git pull', 'git branch', 'git checkout', 'git log', 'git diff',
  // Package managers (read-only operations)
  'npm list', 'npm outdated', 'yarn list', 'pip list', 'pip show',
  // System info (read-only)
  'whoami', 'date', 'uptime', 'df -h', 'du -h', 'ps', 'uname', 'hostname',
  // Text processing
  'echo', 'wc', 'sort', 'uniq', 'cut', 'awk', 'sed', 'grep', 'awk',
  // Network (read-only)
  'ping', 'curl', 'wget', 'nslookup', 'dig', 'traceroute',
  // Development tools (read-only)
  'node --version', 'python --version', 'java -version', 'gcc --version',
  // TauScript specific
  'tauscript', 'tau', 'tau --help', 'tau --version'
];

// Security: Extremely dangerous commands that should never be executed
const NEVER_ALLOW_COMMANDS = [
  'rm -rf /', 'rm -rf /*', 'dd if=/dev/zero of=/dev/sda',
  'mkfs.ext4 /dev/sda', 'fdisk /dev/sda', 'format c:',
  'shutdown -h now', 'reboot -f', 'halt -f', 'poweroff -f',
  'init 0', 'init 6', 'systemctl poweroff', 'systemctl reboot'
];

function getCommandExecutionMode(command: string): 'local' | 'remote' | 'blocked' {
  const lowerCommand = command.toLowerCase();
  
  // Check if command should never be allowed
  const isNeverAllowed = NEVER_ALLOW_COMMANDS.some(blocked => 
    lowerCommand.includes(blocked.toLowerCase())
  );
  
  if (isNeverAllowed) {
    return 'blocked';
  }
  
  // Check if command requires local execution
  const requiresLocal = LOCAL_ONLY_COMMANDS.some(local => 
    lowerCommand.startsWith(local.toLowerCase()) ||
    lowerCommand.includes(' ' + local.toLowerCase() + ' ')
  );
  
  if (requiresLocal) {
    return 'local';
  }
  
  // Check if command is safe for remote execution
  const isRemoteSafe = REMOTE_SAFE_COMMANDS.some(remote => 
    lowerCommand.startsWith(remote.toLowerCase()) ||
    lowerCommand.includes(' ' + remote.toLowerCase() + ' ')
  );
  
  if (isRemoteSafe) {
    return 'remote';
  }
  
  // Default to local for unknown commands (developer-friendly)
  return 'local';
}

function sanitizeCommand(command: string): string {
  // Remove potentially dangerous characters and patterns
  let sanitized = command
    .replace(/[;&|`$(){}[\]\\]/g, '') // Remove shell metacharacters
    .replace(/;\s*(ls|cat|rm|dd|mkfs|fdisk)/gi, '') // Remove dangerous command sequences
    .replace(/\|\s*(cat|less|more|head|tail|grep|awk|sed)\s+/gi, '') // Remove pipe to file reading commands
    .replace(/&&\s*(rm|dd|mkfs|fdisk|shutdown|reboot)/gi, '') // Remove dangerous && sequences
    .replace(/\$\([^)]+\)/g, '') // Remove command substitution
    .replace(/`[^`]+`/g, '') // Remove backtick command substitution
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Additional check: if command contains pipe, reject it entirely
  if (command.includes('|') && !sanitized.includes('|')) {
    // Pipe was removed, but original had it - this is suspicious
    throw new Error('Command contains pipe operator which is not allowed');
  }
  
  return sanitized;
}

export async function POST(request: NextRequest) {
  try {
    const body: TerminalRequest = await request.json();
    let { command, cwd = process.cwd(), sessionId } = body;

    if (!command || typeof command !== 'string') {
      return NextResponse.json({
        success: false,
        output: '',
        error: 'Command is required',
        exitCode: 1,
        cwd
      } as TerminalResponse);
    }

    // Generate or use session ID
    if (!sessionId) {
      sessionId = randomBytes(16).toString('hex');
    }

    // Load session state if exists
    let sessionState = await sessionService.loadTerminalSession(sessionId);
    if (sessionState) {
      cwd = sessionState.cwd || cwd;
    } else {
      // Create new session state
      sessionState = {
        sessionId,
        history: [],
        cwd,
        environment: {},
        lastActivity: Date.now(),
        createdAt: Date.now()
      };
    }

    // Rate limiting
    const rateLimit = await sessionService.checkRateLimit(sessionId, 100, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json({
        success: false,
        output: '',
        error: `Rate limit exceeded. Please wait before sending more commands. (${rateLimit.remaining} requests remaining)`,
        exitCode: 1,
        cwd
      } as TerminalResponse);
    }

    // Security checks
    const sanitizedCommand = sanitizeCommand(command);
    const executionMode = getCommandExecutionMode(sanitizedCommand);
    
    if (executionMode === 'blocked') {
      return NextResponse.json({
        success: false,
        output: '',
        error: `Command '${command}' is blocked for security reasons. This command could cause irreversible damage to the system.`,
        exitCode: 1,
        cwd
      } as TerminalResponse);
    }
    
    if (executionMode === 'local') {
      return NextResponse.json({
        success: false,
        output: '',
        error: `Command '${command}' requires local execution. Please use the local terminal mode or install the TauCore CLI for full system access.`,
        exitCode: 1,
        cwd
      } as TerminalResponse);
    }

    // Special handling for cd command
    if (sanitizedCommand.startsWith('cd ')) {
      const newDir = sanitizedCommand.substring(3).trim();
      try {
        process.chdir(newDir);
        const newCwd = process.cwd();
        return NextResponse.json({
          success: true,
          output: `Changed directory to: ${newCwd}`,
          exitCode: 0,
          cwd: newCwd
        } as TerminalResponse);
      } catch (error) {
        return NextResponse.json({
          success: false,
          output: '',
          error: `Failed to change directory: ${error}`,
          exitCode: 1,
          cwd
        } as TerminalResponse);
      }
    }

    // Execute command (use Docker sandbox if available, fallback to direct execution)
    let result: TerminalResponse;
    
    if (USE_DOCKER_SANDBOX && executionMode === 'remote') {
      // Use Docker sandbox for remote commands
      try {
        const dockerResult = await dockerSandbox.executeCommand(
          sanitizedCommand,
          cwd,
          sessionId,
          {
            timeout: 30000,
            memoryLimit: '512m',
            cpuLimit: '0.5',
            networkDisabled: true // Disable network for security
          }
        );

        result = {
          success: dockerResult.success,
          output: dockerResult.output,
          error: dockerResult.error,
          exitCode: dockerResult.exitCode,
          cwd: cwd // Maintain CWD (Docker handles this internally)
        };
      } catch (dockerError: unknown) {
        // Fallback to direct execution if Docker fails
        console.warn('Docker execution failed, falling back to direct execution:', dockerError);
        const { stdout, stderr } = await execAsync(sanitizedCommand, {
          cwd: cwd,
          timeout: 30000,
          maxBuffer: 1024 * 1024
        });

        const output = stdout || stderr || '';
        const success = !stderr || stderr.length === 0;

        result = {
          success,
          output: output.trim(),
          error: stderr ? stderr.trim() : undefined,
          exitCode: success ? 0 : 1,
          cwd: process.cwd()
        };
      }
    } else {
      // Direct execution for local commands or when Docker is disabled
      const { stdout, stderr } = await execAsync(sanitizedCommand, {
        cwd: cwd,
        timeout: 30000, // 30 second timeout
        maxBuffer: 1024 * 1024 // 1MB buffer
      });

      const output = stdout || stderr || '';
      const success = !stderr || stderr.length === 0;

      result = {
        success,
        output: output.trim(),
        error: stderr ? stderr.trim() : undefined,
        exitCode: success ? 0 : 1,
        cwd: process.cwd()
      };
    }

    // Update session state
    if (sessionState) {
      sessionState.history.push(command);
      // Keep only last 100 commands
      if (sessionState.history.length > 100) {
        sessionState.history = sessionState.history.slice(-100);
      }
      sessionState.cwd = result.cwd;
      sessionState.lastActivity = Date.now();
      await sessionService.saveTerminalSession(sessionState);
    }

    return NextResponse.json({
      ...result,
      sessionId // Include session ID in response
    });

  } catch (error: unknown) {
    console.error('Terminal execution error:', error);
    
    return NextResponse.json({
      success: false,
      output: '',
      error: error.message || 'Command execution failed',
      exitCode: 1,
      cwd: process.cwd()
    } as TerminalResponse);
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
