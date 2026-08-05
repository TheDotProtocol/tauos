'use client';

import Image from 'next/image';

/** Figma 4:715 — syntax-highlighted tau_core_demo.ts editor */
export default function DeveloperCodeEditor() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0d0d0f]">
      <div className="flex h-10 items-center justify-between border-b border-[rgba(255,255,255,0.07)] bg-[#121214] px-4">
        <Image src="/website/icons/developers/window-dots.svg" alt="" width={42} height={10} className="h-2.5 w-[42px]" />
        <span className="text-xs text-[rgba(255,255,255,0.5)]">tau_core_demo.ts</span>
        <Image src="/website/icons/developers/copy.svg" alt="" width={14} height={14} className="size-3.5 opacity-50" />
      </div>
      <div className="space-y-3 p-6 font-mono text-[13px] leading-5">
        <CodeLine>
          <Kw>import </Kw>
          {'{ TauEngine } '}
          <Kw>from </Kw>
          <Str>&quot;@tau-core/node&quot;</Str>;
        </CodeLine>
        <CodeLine>
          <Kw>const </Kw>
          tau = <Kw>await </Kw>
          TauEngine.initialize({'{'}
        </CodeLine>
        <CodeLine>{'  apiKey: process.env.TAU_SECURE_KEY,'}</CodeLine>
        <CodeLine>
          {'  sovereignty: '}
          <Str>&quot;absolute&quot;</Str>,
        </CodeLine>
        <CodeLine>
          {'  realtimeTelemetry: '}
          <Kw>true</Kw>
        </CodeLine>
        <CodeLine>{'});'}</CodeLine>
        <CodeLine>{' '}</CodeLine>
        <CodeLine>
          <Cmt>{'// Securely stream device nodes'}</Cmt>
        </CodeLine>
        <CodeLine>
          <Kw>await </Kw>
          tau.sync({'{'}
        </CodeLine>
        <CodeLine>
          {'  target: '}
          <Str>&quot;tau-phone-mesh&quot;</Str>,
        </CodeLine>
        <CodeLine>
          {'  encryptionMode: '}
          <Str>&quot;end-to-end&quot;</Str>
        </CodeLine>
        <CodeLine>{'});'}</CodeLine>
      </div>
    </div>
  );
}

function CodeLine({ children }: { children: React.ReactNode }) {
  return <div className="text-white">{children}</div>;
}

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-[#c5a44e]">{children}</span>;
}

function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-[#9e86e5]">{children}</span>;
}

function Cmt({ children }: { children: React.ReactNode }) {
  return <span className="text-[rgba(255,255,255,0.5)]">{children}</span>;
}
