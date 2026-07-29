'use client';

import dynamic from 'next/dynamic';
import { useRef, useEffect, useCallback } from 'react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  enableLSP?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  enableLSP = true,
}: CodeEditorProps) {
  const editorRef = useRef<unknown>(null);
  const monacoRef = useRef<unknown>(null);

  const fetchLSP = useCallback(async (method: string, params: Record<string, unknown>) => {
    const res = await fetch('/api/developers/tauscript/lsp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, params: { source: value, ...params } }),
    });
    return res.json();
  }, [value]);

  useEffect(() => {
    if (!enableLSP || language !== 'tauscript') return;
    const timer = setTimeout(async () => {
      try {
        const { diagnostics } = await fetchLSP('textDocument/publishDiagnostics', {});
        const monaco = monacoRef.current as { editor?: { setModelMarkers: (model: unknown, owner: string, markers: unknown[]) => void } } | null;
        const editor = editorRef.current as { getModel?: () => unknown } | null;
        if (monaco?.editor && editor?.getModel && diagnostics?.length) {
          monaco.editor.setModelMarkers(editor.getModel(), 'tauscript', diagnostics.map((d: { message: string; line: number; column: number; severity: string }) => ({
            startLineNumber: d.line,
            startColumn: d.column,
            endLineNumber: d.line,
            endColumn: d.column + 10,
            message: d.message,
            severity: d.severity === 'error' ? 8 : d.severity === 'warning' ? 4 : 2,
          })));
        }
      } catch { /* LSP optional */ }
    }, 800);
    return () => clearTimeout(timer);
  }, [value, enableLSP, language, fetchLSP]);

  return (
    <MonacoEditor
      height="100%"
      language={language === 'tauscript' ? 'javascript' : language}
      theme="vs-dark"
      value={value}
      onChange={(v) => onChange(v ?? '')}
      onMount={(editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        if (language === 'tauscript' && enableLSP) {
          monaco.languages.registerCompletionItemProvider('javascript', {
            triggerCharacters: ['.', '"'],
            provideCompletionItems: async (model: { getValue: () => string }, position: { lineNumber: number; column: number }) => {
              const result = await fetch('/api/developers/tauscript/lsp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  method: 'textDocument/completion',
                  params: { source: model.getValue(), position: { line: position.lineNumber - 1, character: position.column - 1 } },
                }),
              }).then((r) => r.json());
              return {
                suggestions: (result.items ?? []).map((item: { label: string; kind: string; detail?: string; insertText?: string }) => ({
                  label: item.label,
                  kind: monaco.languages.CompletionItemKind.Function,
                  detail: item.detail,
                  insertText: item.insertText ?? item.label,
                })),
              };
            },
          });
        }
      }}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Menlo, monospace',
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        padding: { top: 12 },
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
      }}
    />
  );
}
