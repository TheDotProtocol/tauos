'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = {
  title: string;
  content: string;
};

export default function MarkdownDocViewer({ title, content }: Props) {
  return (
    <article className="max-w-none">
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All documentation
      </Link>
      <div className="txp-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </article>
  );
}
