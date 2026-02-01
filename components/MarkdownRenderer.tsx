import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isLightMode: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isLightMode }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');
            const id = Math.random().toString(36).substr(2, 9);

            return !inline && match ? (
              <div className="relative group my-4">
                <div className="absolute right-2 top-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(codeContent, id)}
                    className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
                    title="Copy code"
                  >
                    {copiedId === id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <SyntaxHighlighter
                  style={isLightMode ? vs : vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg !bg-slate-900/50 !my-0 border border-slate-700/50"
                  {...props}
                >
                  {codeContent}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={`${className} bg-slate-800/50 px-1 rounded text-emerald-400 font-mono text-sm`} {...props}>
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-4 leading-relaxed opacity-90">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside mb-4 space-y-1 opacity-90">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside mb-4 space-y-1 opacity-90">{children}</ol>;
          },
          h1({ children }) { return <h1 className="text-2xl font-bold mb-4 text-emerald-500">{children}</h1>; },
          h2({ children }) { return <h2 className="text-xl font-bold mb-3 text-emerald-500">{children}</h2>; },
          h3({ children }) { return <h3 className="text-lg font-bold mb-2 text-emerald-500">{children}</h3>; },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
