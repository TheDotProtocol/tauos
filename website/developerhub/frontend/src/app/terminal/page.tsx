'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Terminal as TerminalIcon, 
  Play, 
  Square, 
  RotateCcw, 
  Download, 
  Upload,
  Settings,
  Plus,
  X,
  ChevronDown,
  Code,
  Database,
  Cloud,
  Zap,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface TerminalTab {
  id: string;
  title: string;
  type: 'local' | 'remote' | 'docker' | 'tauscript';
  active: boolean;
  content: TerminalLine[];
  cwd: string;
  history: string[];
  historyIndex: number;
  executionMode: 'local' | 'remote' | 'hybrid';
}

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'info';
  content: string;
  timestamp: Date;
  command?: string;
}

interface CommandResponse {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
  cwd: string;
}

interface LocalTerminalResponse {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
  cwd: string;
  executionMode: 'local';
}

interface TauScriptResponse {
  success: boolean;
  output: string;
  error?: string;
  result?: any;
  executionTime: number;
}

export default function TerminalPage() {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: '1',
      title: 'Hybrid Terminal',
      type: 'local',
      active: true,
      content: [
        { type: 'info', content: 'TauCore™ Hybrid Terminal v1.0.0', timestamp: new Date() },
        { type: 'info', content: 'Hybrid mode: Safe commands run remotely, system commands require local execution.', timestamp: new Date() },
        { type: 'info', content: 'Type commands to get started. Use "help" for available commands.', timestamp: new Date() }
      ],
      cwd: '/workspace',
      history: [],
      historyIndex: -1,
      executionMode: 'hybrid'
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [tabs]);

  // Focus input when tab changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tabs]);

  const getCurrentTab = () => tabs.find(tab => tab.active) || tabs[0];

  const addTab = (type: TerminalTab['type']) => {
    const executionMode = type === 'tauscript' ? 'hybrid' : 
                         type === 'remote' ? 'remote' : 
                         type === 'docker' ? 'hybrid' : 'hybrid';
    
    const newTab: TerminalTab = {
      id: Date.now().toString(),
      title: type === 'tauscript' ? 'TauScript REPL' : 
             type === 'remote' ? 'Remote Server' :
             type === 'docker' ? 'Docker Container' : 'Hybrid Terminal',
      type,
      active: false,
      content: [
        { type: 'info', content: `${type === 'tauscript' ? 'TauScript REPL' : 'Terminal'} initialized`, timestamp: new Date() },
        { type: 'info', content: `Execution mode: ${executionMode}`, timestamp: new Date() },
        { type: 'info', content: 'Ready for commands...', timestamp: new Date() }
      ],
      cwd: '/workspace',
      history: [],
      historyIndex: -1,
      executionMode
    };
    
    setTabs(prev => prev.map(tab => ({ ...tab, active: false })).concat([{ ...newTab, active: true }]));
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    if (tabs[tabIndex].active) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      newTabs[newActiveIndex].active = true;
    }
    
    setTabs(newTabs);
  };

  const switchTab = (tabId: string) => {
    setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === tabId })));
  };

  const executeCommand = async (command: string) => {
    const currentTab = getCurrentTab();
    if (!command.trim()) return;

    setIsRunning(true);

    // Add command to history
    const newHistory = [...currentTab.history, command];
    const newHistoryIndex = newHistory.length;

    // Add command line to terminal
    const commandLine: TerminalLine = {
      type: 'command',
      content: command,
      timestamp: new Date(),
      command: command
    };

    setTabs(prev => prev.map(tab => 
      tab.id === currentTab.id 
        ? { 
            ...tab, 
            content: [...tab.content, commandLine],
            history: newHistory,
            historyIndex: newHistoryIndex
          }
        : tab
    ));

    try {
      if (currentTab.type === 'tauscript') {
        await executeTauScript(command);
      } else {
        await executeHybridCommand(command);
      }
    } catch (error) {
      console.error('Command execution error:', error);
      addOutputLine('error', `Execution error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const executeHybridCommand = async (command: string) => {
    const currentTab = getCurrentTab();
    
    try {
      // First try remote execution
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: command,
          cwd: currentTab.cwd,
          sessionId: currentTab.id
        }),
      });

      const result: CommandResponse = await response.json();
      
      if (result.success) {
        addOutputLine('output', `[REMOTE] ${result.output}`);
        // Update working directory if it changed
        if (result.cwd !== currentTab.cwd) {
          setTabs(prev => prev.map(tab => 
            tab.id === currentTab.id 
              ? { ...tab, cwd: result.cwd }
              : tab
          ));
        }
      } else if (result.error?.includes('requires local execution')) {
        // Try local execution for system commands
        await executeLocalCommand(command);
      } else {
        addOutputLine('error', result.error || result.output);
      }
    } catch (error) {
      addOutputLine('error', `Network error: ${error}`);
    }
  };

  const executeLocalCommand = async (command: string) => {
    const currentTab = getCurrentTab();
    
    try {
      const response = await fetch('/api/terminal/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: command,
          cwd: currentTab.cwd,
          sessionId: currentTab.id
        }),
      });

      const result: LocalTerminalResponse = await response.json();
      
      if (result.success) {
        addOutputLine('output', `[LOCAL] ${result.output}`);
        // Update working directory if it changed
        if (result.cwd !== currentTab.cwd) {
          setTabs(prev => prev.map(tab => 
            tab.id === currentTab.id 
              ? { ...tab, cwd: result.cwd }
              : tab
          ));
        }
      } else {
        addOutputLine('error', `[LOCAL] ${result.error || result.output}`);
      }
    } catch (error) {
      addOutputLine('error', `[LOCAL] Network error: ${error}`);
    }
  };

  const executeTauScript = async (code: string) => {
    try {
      const response = await fetch('/api/terminal/tauscript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          sessionId: getCurrentTab().id
        }),
      });

      const result: TauScriptResponse = await response.json();
      
      if (result.success) {
        addOutputLine('output', result.output);
        if (result.executionTime) {
          addOutputLine('info', `Execution time: ${result.executionTime}ms`);
        }
      } else {
        addOutputLine('error', result.error || 'TauScript execution failed');
      }
    } catch (error) {
      addOutputLine('error', `TauScript error: ${error}`);
    }
  };

  const addOutputLine = (type: TerminalLine['type'], content: string) => {
    const currentTab = getCurrentTab();
    const outputLine: TerminalLine = {
      type,
      content,
      timestamp: new Date()
    };

    setTabs(prev => prev.map(tab => 
      tab.id === currentTab.id 
        ? { ...tab, content: [...tab.content, outputLine] }
        : tab
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const currentTab = getCurrentTab();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentTab.historyIndex > 0) {
        const newIndex = currentTab.historyIndex - 1;
        setCurrentInput(currentTab.history[newIndex]);
        setTabs(prev => prev.map(tab => 
          tab.id === currentTab.id 
            ? { ...tab, historyIndex: newIndex }
            : tab
        ));
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentTab.historyIndex < currentTab.history.length - 1) {
        const newIndex = currentTab.historyIndex + 1;
        setCurrentInput(currentTab.history[newIndex]);
        setTabs(prev => prev.map(tab => 
          tab.id === currentTab.id 
            ? { ...tab, historyIndex: newIndex }
            : tab
        ));
      } else {
        setCurrentInput('');
        setTabs(prev => prev.map(tab => 
          tab.id === currentTab.id 
            ? { ...tab, historyIndex: currentTab.history.length }
            : tab
        ));
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      if (isRunning) {
        addOutputLine('info', 'Command interrupted');
        setIsRunning(false);
      }
    }
  };

  const clearTerminal = () => {
    const currentTab = getCurrentTab();
    setTabs(prev => prev.map(tab => 
      tab.id === currentTab.id 
        ? { ...tab, content: [] }
        : tab
    ));
  };

  const getPrompt = () => {
    const currentTab = getCurrentTab();
    if (currentTab.type === 'tauscript') {
      return 'τ ';
    }
    return `$ `;
  };

  const getStatusIcon = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command': return '>';
      case 'output': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'error': return <XCircle className="h-3 w-3 text-red-500" />;
      case 'info': return <AlertTriangle className="h-3 w-3 text-blue-500" />;
      default: return '>';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <TerminalIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    TauCore™ Terminal
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Full-featured terminal with real command execution and TauScript REPL
                  </p>
                </div>
              </div>
            </div>

            {/* Terminal Interface */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              {/* Terminal Header */}
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-300 text-sm ml-4">
                    {getCurrentTab().title} - {getCurrentTab().cwd}
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded">
                      {getCurrentTab().executionMode.toUpperCase()}
                    </span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearTerminal}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Clear terminal"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Tab Bar */}
              <div className="bg-gray-800 border-b border-gray-700 flex">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center px-4 py-2 border-r border-gray-700 cursor-pointer ${
                      tab.active 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                    onClick={() => switchTab(tab.id)}
                  >
                    <TerminalIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{tab.title}</span>
                    {tabs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.id);
                        }}
                        className="ml-2 p-1 hover:bg-gray-600 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                
                <div className="flex items-center px-2">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => addTab('local')}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="New Local Terminal"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => addTab('tauscript')}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="New TauScript REPL"
                    >
                      <Code className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => addTab('remote')}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="New Remote Terminal"
                    >
                      <Cloud className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => addTab('docker')}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="New Docker Terminal"
                    >
                      <Database className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Terminal Content */}
              <div 
                ref={terminalRef}
                className="h-96 overflow-y-auto p-4 font-mono text-sm text-green-400 bg-gray-900"
              >
                {getCurrentTab().content.map((line, index) => (
                  <div key={index} className="flex items-start mb-1">
                    <span className="mr-2 text-gray-500">
                      {getStatusIcon(line.type)}
                    </span>
                    <span className={`${
                      line.type === 'command' ? 'text-blue-400' :
                      line.type === 'error' ? 'text-red-400' :
                      line.type === 'info' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {line.content}
                    </span>
                  </div>
                ))}
                
                {/* Input Line */}
                <div className="flex items-center">
                  <span className="mr-2 text-gray-500">
                    {isRunning ? <Loader2 className="h-3 w-3 animate-spin text-yellow-400" /> : '>'}
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isRunning}
                    className="flex-1 bg-transparent text-green-400 outline-none disabled:opacity-50"
                    placeholder={getCurrentTab().type === 'tauscript' ? 'Enter TauScript code...' : 'Enter command...'}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      TauScript REPL
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Interactive TauScript interpreter
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <TerminalIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      System Commands
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Execute real shell commands
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Git Integration
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Full Git command support
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Package Managers
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      npm, yarn, pip support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}