import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

interface TerminalProps {
  className?: string;
  initialPrompt?: string;
  onCommand?: (command: string) => void;
  output?: string[];
  isLoading?: boolean;
}

const Terminal: React.FC<TerminalProps> = ({
  className,
  initialPrompt = '$',
  onCommand,
  output = [],
  isLoading = false
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        setHistory(prev => [...prev, input]);
        setHistoryIndex(-1);
        onCommand?.(input);
        setInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      if (isLoading) {
        // Handle interrupt
        onCommand?.('^C');
      }
    }
  };

  return (
    <div className={cn("bg-tau-black-900 rounded-lg border border-tau-gray-600 overflow-hidden", className)}>
      {/* Terminal Header */}
      <div className="bg-tau-gray-800 px-4 py-2 flex items-center justify-between border-b border-tau-gray-600">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-tau-gray-300 text-sm ml-4">TauCore™ Terminal</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="h-64 overflow-y-auto p-4 font-mono text-sm text-tau-gold-500 bg-tau-black-900"
      >
        {output.map((line, index) => (
          <div key={index} className="mb-1">
            <span className="text-tau-gray-500 mr-2">{initialPrompt}</span>
            <span className="text-tau-gold-500">{line}</span>
          </div>
        ))}
        
        {/* Input Line */}
        <div className="flex items-center">
          <span className="text-tau-gray-500 mr-2">
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-tau-gold-500 border-t-transparent rounded-full"></div>
            ) : (
              initialPrompt
            )}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 bg-transparent text-tau-gold-500 outline-none disabled:opacity-50"
            placeholder="Enter command..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export { Terminal };
