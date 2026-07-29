import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface FormattedAIMessageProps {
  content: string;
}

/**
 * Pre-processes AI responses to convert raw LaTeX/math strings into clean Unicode characters,
 * fix escaped dollar signs, and ensure crisp readable output.
 */
function preprocessAIMarkdown(text: string): string {
  if (!text) return '';

  return text
    // Replace escaped dollar signs or dollar wrappers
    .replace(/\\\$|\$/g, '')
    // Replace common LaTeX symbols with clean Unicode equivalents
    .replace(/\\pm/g, '±')
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\cdot/g, '·')
    .replace(/\\sqrt/g, '√')
    .replace(/\\approx/g, '≈')
    .replace(/\\neq/g, '≠')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\pi/g, 'π')
    .replace(/\\theta/g, 'θ')
    .replace(/\\degree/g, '°')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)');
}

export const FormattedAIMessage: React.FC<FormattedAIMessageProps> = ({ content }) => {
  const processedText = preprocessAIMarkdown(content);

  return (
    <div className="prose prose-slate prose-xs sm:prose-sm max-w-none text-slate-800 space-y-3 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-black text-slate-900 border-b border-indigo-100 pb-1.5 mt-4 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-bold text-indigo-950 mt-3 mb-1.5 flex items-center gap-2 bg-indigo-50/80 px-3 py-1.5 rounded-xl border border-indigo-100">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-3 mb-1 text-indigo-900 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-indigo-600 rounded-full inline-block"></span>
              <span>{children}</span>
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 mt-2 mb-1 text-slate-900 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/80">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-xs sm:text-sm text-slate-700 leading-normal my-1.5">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2 pl-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2 list-decimal list-inside text-slate-800 text-xs sm:text-sm font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span className="flex-1">{children}</span>
            </li>
          ),
          strong: ({ children }) => {
            const str = String(children);
            if (str.toLowerCase().includes('pitfall') || str.toLowerCase().includes('trap') || str.toLowerCase().includes('mistake')) {
              return (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold text-xs border border-amber-200">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  {children}
                </span>
              );
            }
            if (str.toLowerCase().includes('rule') || str.toLowerCase().includes('tip') || str.toLowerCase().includes('formula')) {
              return (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-bold text-xs border border-emerald-200">
                  <Lightbulb className="w-3 h-3 text-emerald-600" />
                  {children}
                </span>
              );
            }
            return <strong className="font-bold text-indigo-950 bg-indigo-50/60 px-1 rounded">{children}</strong>;
          },
          blockquote: ({ children }) => (
            <div className="p-3 my-2 bg-amber-50/90 border-l-4 border-amber-400 rounded-r-xl text-amber-900 text-xs sm:text-sm space-y-1">
              {children}
            </div>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 bg-indigo-50 text-indigo-900 rounded border border-indigo-200/80 font-mono text-[11px] sm:text-xs">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="p-3 bg-slate-900 text-emerald-300 rounded-2xl overflow-x-auto text-xs font-mono my-2 shadow-inner">
              {children}
            </pre>
          )
        }}
      >
        {processedText}
      </ReactMarkdown>
    </div>
  );
};
