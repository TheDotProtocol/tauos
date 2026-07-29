'use client';

import { useEffect, useRef } from 'react';

interface ArchitectureDiagramProps {
  diagram: string;
  className?: string;
}

export default function ArchitectureDiagram({ diagram, className = '' }: ArchitectureDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !diagram) return;

    // Render mermaid if available, otherwise show structured fallback
    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ startOnLoad: false, theme: 'dark', themeVariables: { primaryColor: '#00d4ff', primaryTextColor: '#fff', lineColor: '#00d4ff', secondaryColor: '#1a1a1a' } });
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, diagram);
        if (ref.current) ref.current.innerHTML = svg;
      } catch {
        // Fallback: render as structured text diagram
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-xs text-cyan-300 font-mono whitespace-pre-wrap p-4 bg-black/40 rounded-lg overflow-x-auto">${escapeHtml(diagram)}</pre>`;
        }
      }
    };

    renderDiagram();
  }, [diagram]);

  return (
    <div className={`glass rounded-xl p-4 border border-cyan-500/20 ${className}`}>
      <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Architecture Diagram</p>
      <div ref={ref} className="flex justify-center overflow-x-auto min-h-[120px]" />
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
