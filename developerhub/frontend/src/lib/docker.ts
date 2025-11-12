/**
 * Docker Sandbox Service
 * Provides secure container-based command execution with isolation
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { randomBytes } from 'crypto';

const execAsync = promisify(exec);

export interface DockerExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
  containerId?: string;
}

export interface DockerConfig {
  image?: string;
  timeout?: number;
  memoryLimit?: string;
  cpuLimit?: string;
  networkDisabled?: boolean;
}

class DockerSandbox {
  private readonly defaultImage = 'tauos-sandbox:latest';
  private readonly defaultTimeout = 30000; // 30 seconds
  private readonly defaultMemoryLimit = '512m';
  private readonly defaultCpuLimit = '0.5';
  private readonly containerTTL = 300000; // 5 minutes

  /**
   * Build the sandbox image if it doesn't exist
   */
  async ensureImage(imageName: string = this.defaultImage): Promise<boolean> {
    try {
      // Check if image exists
      const { stdout } = await execAsync(`docker images -q ${imageName}`);
      if (stdout.trim()) {
        return true;
      }

      // Build image
      const dockerfilePath = process.cwd() + '/../docker/Dockerfile.sandbox';
      console.log(`Building Docker image ${imageName} from ${dockerfilePath}...`);
      
      await execAsync(
        `docker build -f ${dockerfilePath} -t ${imageName} ${process.cwd()}/../docker`,
        { timeout: 120000 } // 2 minutes for build
      );

      console.log(`✅ Docker image ${imageName} built successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to build Docker image: ${error}`);
      return false;
    }
  }

  /**
   * Execute a command in a Docker container
   */
  async executeCommand(
    command: string,
    cwd: string = '/workspace',
    sessionId?: string,
    config: DockerConfig = {}
  ): Promise<DockerExecutionResult> {
    const containerName = `tauos-sandbox-${sessionId || randomBytes(8).toString('hex')}-${Date.now()}`;
    const image = config.image || this.defaultImage;
    const timeout = config.timeout || this.defaultTimeout;
    const memoryLimit = config.memoryLimit || this.defaultMemoryLimit;
    const cpuLimit = config.cpuLimit || this.defaultCpuLimit;
    const networkDisabled = config.networkDisabled !== false; // Default to disabled for security

    try {
      // Ensure image exists
      const imageExists = await this.ensureImage(image);
      if (!imageExists) {
        // Fallback to direct execution if Docker is not available
        console.warn('Docker image not available, falling back to direct execution');
        return await this.fallbackExecution(command, cwd);
      }

      // Create and start container
      const seccompPath = process.cwd() + '/../docker/seccomp-profile.json';
      const createCmd = [
        'docker run -d',
        `--name ${containerName}`,
        `--memory=${memoryLimit}`,
        `--cpus=${cpuLimit}`,
        `--user 1000:1000`,
        `--read-only`,
        `--tmpfs /tmp:rw,noexec,nosuid,size=100m`,
        `--tmpfs /workspace:rw,noexec,nosuid`,
        networkDisabled ? '--network none' : '',
        `--security-opt seccomp=${seccompPath}`,
        `--cap-drop ALL`,
        `--security-opt no-new-privileges:true`,
        `--workdir ${cwd}`,
        `--rm`, // Auto-remove on exit
        image,
        '/bin/bash', '-c', `cd ${cwd} && ${command}`
      ].filter(Boolean).join(' ');

      // Create container
      const { stdout: containerId } = await execAsync(createCmd.trim());
      const actualContainerId = containerId.trim();

      // Wait for container to complete with timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Command execution timeout')), timeout);
      });

      const waitPromise = execAsync(`docker wait ${actualContainerId}`);
      await Promise.race([waitPromise, timeoutPromise]);

      // Get exit code
      const { stdout: exitCodeStr } = await execAsync(`docker inspect -f '{{.State.ExitCode}}' ${actualContainerId}`);
      const exitCode = parseInt(exitCodeStr.trim(), 10);

      // Get logs
      const { stdout: logs, stderr: errorLogs } = await execAsync(`docker logs ${actualContainerId} 2>&1`);

      // Cleanup (container should auto-remove, but force cleanup just in case)
      try {
        await execAsync(`docker rm -f ${actualContainerId} 2>/dev/null || true`);
      } catch {
        // Ignore cleanup errors
      }

      const output = logs || '';
      const error = errorLogs || (exitCode !== 0 ? `Command exited with code ${exitCode}` : undefined);

      return {
        success: exitCode === 0,
        output: output.trim(),
        error: error?.trim(),
        exitCode,
        containerId: actualContainerId
      };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Cleanup on error
      try {
        await execAsync(`docker rm -f ${containerName} 2>/dev/null || true`);
      } catch {
        // Ignore cleanup errors
      }

      // If Docker is not available, fallback to direct execution
      if (errorMessage.includes('Cannot connect to the Docker daemon') || 
          errorMessage.includes('docker: command not found')) {
        console.warn('Docker not available, falling back to direct execution');
        return await this.fallbackExecution(command, cwd);
      }

      return {
        success: false,
        output: '',
        error: `Docker execution failed: ${errorMessage}`,
        exitCode: 1
      };
    }
  }

  /**
   * Fallback execution when Docker is not available
   */
  private async fallbackExecution(command: string, cwd: string): Promise<DockerExecutionResult> {
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd,
        timeout: 30000,
        maxBuffer: 1024 * 1024
      });

      return {
        success: true,
        output: stdout?.trim() || '',
        error: stderr?.trim(),
        exitCode: 0
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Check if it's a command execution error with exit code
      if (error instanceof Error && 'code' in error) {
        const exitCode = (error as { code?: number }).code || 1;
        return {
          success: false,
          output: '',
          error: errorMessage,
          exitCode
        };
      }
      return {
        success: false,
        output: '',
        error: errorMessage,
        exitCode: 1
      };
    }
  }

  /**
   * Clean up old containers
   */
  async cleanup(): Promise<void> {
    try {
      // Remove containers older than TTL
      await execAsync(
        `docker ps -a --filter "name=tauos-sandbox-" --format "{{.ID}} {{.CreatedAt}}" | ` +
        `awk -v ttl=${this.containerTTL} '{
          split($2, dt, "T");
          split(dt[2], tm, ".");
          split(dt[1], date, "-");
          split(tm[1], time, ":");
          created = mktime(date[1] " " date[2] " " date[3] " " time[1] " " time[2] " " time[3]);
          now = systime();
          if (now - created > ttl) print $1
        }' | xargs -r docker rm -f 2>/dev/null || true`
      );
    } catch {
      // Ignore cleanup errors
    }
  }
}

// Singleton instance
export const dockerSandbox = new DockerSandbox();

