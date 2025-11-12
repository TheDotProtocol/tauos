'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Code, 
  Play, 
  Square, 
  Plus,
  X,
  ChevronDown,
  Terminal,
  Loader2,
  File,
  Folder,
  Bug
} from 'lucide-react';

interface FileTab {
  id: string;
  name: string;
  path: string;
  content: string;
  modified: boolean;
  active: boolean;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

export default function IDEPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabs, setTabs] = useState<FileTab[]>([
    {
      id: 'welcome',
      name: 'Welcome.tau',
      path: '/welcome.tau',
      content: `// TauStudio IDE - Welcome to TauScript Development
// The ultimate development environment for privacy-first programming

import std.io;
import std.net;
import std.crypto;

fn main() {
    io.println("Welcome to TauStudio IDE!");
    io.println("Built for the TauCore™ ecosystem");
    
    // Create a simple web server
    let server = net.Server.new("localhost:8080");
    server.onRequest(handleRequest);
    server.start();
    
    io.println("Server started on http://localhost:8080");
}

fn handleRequest(req: net.Request) -> net.Response {
    let response = net.Response.new();
    response.setHeader("Content-Type", "text/html");
    response.setBody("<h1>Hello from TauScript!</h1>");
    return response;
}`,
      modified: false,
      active: true
    }
  ]);
  const [activeTab, setActiveTab] = useState('welcome');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>(['TauCore™ Terminal - Type commands to get started', 'Type "help" for available commands']);
  const [fileExplorerOpen, setFileExplorerOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [debuggerOpen, setDebuggerOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  const fileTree: FileNode[] = [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      path: '/src',
      children: [
        {
          id: 'main',
          name: 'main.tau',
          type: 'file',
          path: '/src/main.tau'
        },
        {
          id: 'utils',
          name: 'utils.tau',
          type: 'file',
          path: '/src/utils.tau'
        }
      ]
    },
    {
      id: 'tests',
      name: 'tests',
      type: 'folder',
      path: '/tests',
      children: [
        {
          id: 'test-main',
          name: 'test_main.tau',
          type: 'file',
          path: '/tests/test_main.tau'
        }
      ]
    },
    {
      id: 'docs',
      name: 'docs',
      type: 'folder',
      path: '/docs',
      children: [
        {
          id: 'readme',
          name: 'README.md',
          type: 'file',
          path: '/docs/README.md'
        }
      ]
    }
  ];

  const getCurrentTab = () => tabs.find(tab => tab.id === activeTab) || tabs[0];

  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
    setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === tabId })));
  };

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    if (newTabs.length > 0) {
      const newActiveTab = newTabs[newTabs.length - 1];
      setActiveTab(newActiveTab.id);
      setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === newActiveTab.id })));
    }
    setTabs(newTabs);
  };

  // Focus terminal input when terminal opens
  useEffect(() => {
    if (terminalOpen && terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, [terminalOpen]);

  const runCode = async () => {
    const currentTab = getCurrentTab();
    if (!currentTab) return;

    setIsRunning(true);
    setOutput((prev) => [...prev, `\n> Executing ${currentTab.name}...\n`]);
    
    try {
      const response = await fetch('/api/terminal/tauscript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: currentTab.content || '',
          sessionId: 'ide-session'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setOutput((prev) => [...prev, result.output || 'Code executed successfully']);
      } else {
        setOutput((prev) => [...prev, `Error: ${result.error || 'Execution failed'}`]);
      }
    } catch (error) {
      setOutput((prev) => [...prev, `Error: ${error}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const executeTerminalCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add command to history
    const newHistory = [...terminalHistory, command];
    setTerminalHistory(newHistory);
    setHistoryIndex(newHistory.length);
    
    // Display command
    setOutput((prev) => [...prev, `$ ${command}`]);
    setTerminalInput('');
    setIsRunning(true);

    try {
      // Check if it's a TauScript command
      if (command.trim().startsWith('tau ') || command.trim() === 'tau') {
        // Execute as TauScript
        const code = command.replace(/^tau\s+/, '');
        const response = await fetch('/api/terminal/tauscript', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code || getCurrentTab()?.content || '',
            sessionId: 'ide-terminal'
          }),
        });

        const result = await response.json();
        if (result.success) {
          setOutput((prev) => [...prev, result.output]);
        } else {
          setOutput((prev) => [...prev, `Error: ${result.error || 'Execution failed'}`]);
        }
      } else if (command.trim() === 'help' || command.trim() === 'h') {
        // Built-in help
        setOutput((prev) => [...prev, 
          'Available commands:',
          '  tau <code>     - Execute TauScript code',
          '  tau help       - Show TauScript help',
          '  ls             - List files',
          '  pwd            - Print working directory',
          '  echo <text>    - Print text',
          '  help           - Show this help'
        ]);
      } else {
        // Execute as shell command
        const response = await fetch('/api/terminal/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            command: command,
            cwd: '/workspace',
            sessionId: 'ide-terminal'
          }),
        });

        const result = await response.json();
        if (result.success) {
          setOutput((prev) => [...prev, result.output]);
        } else {
          setOutput((prev) => [...prev, `Error: ${result.error || result.output || 'Command failed'}`]);
        }
      }
    } catch (error) {
      setOutput((prev) => [...prev, `Error: ${error}`]);
    } finally {
      setIsRunning(false);
      // Focus input again
      setTimeout(() => terminalInputRef.current?.focus(), 100);
    }
  };

  const handleTerminalKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeTerminalCommand(terminalInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setTerminalInput(terminalHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < terminalHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setTerminalInput(terminalHistory[newIndex]);
      } else {
        setTerminalInput('');
        setHistoryIndex(terminalHistory.length);
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      if (isRunning) {
        setOutput((prev) => [...prev, '\n^C - Command interrupted']);
        setIsRunning(false);
      }
    }
  };

  const stopCode = () => {
    setIsRunning(false);
    setOutput(prev => [...prev, '🛑 Code execution stopped']);
  };

  const formatCode = () => {
    // Simulate code formatting
    setOutput(prev => [...prev, '✨ Code formatted successfully']);
  };

  const debugCode = () => {
    setDebuggerOpen(true);
    setOutput(prev => [...prev, '🐛 Debugger started - Set breakpoints to debug']);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="h-screen flex flex-col">
            {/* IDE Toolbar */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded text-sm"
                >
                  {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                <button
                  onClick={stopCode}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
                <button
                  onClick={debugCode}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  <Bug className="w-4 h-4" />
                  Debug
                </button>
                <button
                  onClick={formatCode}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
                >
                  <Code className="w-4 h-4" />
                  Format
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFileExplorerOpen(!fileExplorerOpen)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Folder className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTerminalOpen(!terminalOpen)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Terminal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDebuggerOpen(!debuggerOpen)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Bug className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex">
              {/* File Explorer */}
              {fileExplorerOpen && (
                <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Explorer</h3>
                  </div>
                  <div className="p-2">
                    {fileTree.map(node => (
                      <FileTreeNode key={node.id} node={node} />
                    ))}
                  </div>
                </div>
              )}

              {/* Main Editor Area */}
              <div className="flex-1 flex flex-col">
                {/* Tab Bar */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    {tabs.map(tab => (
                      <div
                        key={tab.id}
                        className={`flex items-center space-x-2 px-4 py-2 border-r border-gray-200 dark:border-gray-700 cursor-pointer ${
                          tab.active ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => switchTab(tab.id)}
                      >
                        <Code className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-900 dark:text-white">{tab.name}</span>
                        {tab.modified && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeTab(tab.id);
                          }}
                          className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 flex">
                  <div className="flex-1 bg-white dark:bg-gray-900">
                    <div className="h-full p-4">
                      <textarea
                        className="w-full h-full bg-transparent text-gray-900 dark:text-white font-mono text-sm resize-none outline-none"
                        value={getCurrentTab()?.content || ''}
                        onChange={(e) => {
                          const newContent = e.target.value;
                          setTabs(prev => prev.map(tab => 
                            tab.id === activeTab 
                              ? { ...tab, content: newContent, modified: true }
                              : tab
                          ));
                        }}
                        placeholder="Start typing your TauScript code..."
                      />
                    </div>
                  </div>

                  {/* Debugger Panel */}
                  {debuggerOpen && (
                    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Debugger</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Breakpoints:</div>
                          <div className="text-sm text-gray-900 dark:text-white">main.tau:5</div>
                          <div className="text-sm text-gray-900 dark:text-white">main.tau:12</div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Variables:</div>
                          <div className="text-sm text-gray-900 dark:text-white">server = Server {`{`} host: &quot;localhost&quot;, port: 8080 {`}`}</div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Call Stack:</div>
                          <div className="text-sm text-gray-900 dark:text-white">main()</div>
                          <div className="text-sm text-gray-900 dark:text-white">handleRequest()</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terminal Panel */}
                {terminalOpen && (
                  <div className="h-64 bg-black text-green-400 font-mono text-sm border-t border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                      {output.map((line, index) => (
                        <div key={index} className="whitespace-pre-wrap break-words">{line}</div>
                      ))}
                      {isRunning && (
                        <div className="flex items-center space-x-2 text-yellow-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Executing...</span>
                        </div>
                      )}
                    </div>
                    {/* Terminal Input */}
                    <div className="border-t border-gray-700 p-2 flex items-center space-x-2">
                      <span className="text-gray-500">$</span>
                      <input
                        ref={terminalInputRef}
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={handleTerminalKeyPress}
                        disabled={isRunning}
                        className="flex-1 bg-transparent text-green-400 outline-none disabled:opacity-50 placeholder-gray-600"
                        placeholder="Type command and press Enter... (use 'tau' prefix for TauScript)"
                        autoComplete="off"
                      />
                      {isRunning && (
                        <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function FileTreeNode({ node }: { node: FileNode }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="ml-2">
      <div 
        className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
        onClick={() => node.type === 'folder' && setExpanded(!expanded)}
      >
        {node.type === 'folder' && (
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-0' : '-rotate-90'}`} />
        )}
        {node.type === 'folder' ? (
          <Folder className="w-4 h-4 text-blue-500" />
        ) : (
          <File className="w-4 h-4 text-gray-500" />
        )}
        <span className="text-sm text-gray-900 dark:text-white">{node.name}</span>
      </div>
      {node.children && expanded && (
        <div className="ml-4">
          {node.children.map(child => (
            <FileTreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
