import React, { useState } from 'react';
import { Code2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { MERGE_SORT_METADATA } from '../../algorithms/sorting/mergeSort';
import type { AlgorithmMetadata } from '../../engine/types';

interface CodePanelProps {
  activeLine: number;
  metadata?: AlgorithmMetadata;
  title?: string;
}

export const CodePanel: React.FC<CodePanelProps> = ({
  activeLine,
  metadata = MERGE_SORT_METADATA,
  title = 'Algorithm Pseudocode',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = metadata.pseudocode.lines;

  const handleCopy = () => {
    const codeString = lines.map((l) => '  '.repeat(l.indent) + l.code).join('\n');
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="clay-surface p-5 sm:p-6 mb-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-txt-primary hover:text-accent-secondary transition-colors"
        >
          <Code2 className="w-4 h-4 text-accent-primary" />
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className="text-xs text-txt-muted ml-1">
            {isCollapsed ? <ChevronDown className="w-4 h-4 inline" /> : <ChevronUp className="w-4 h-4 inline" />}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-txt-muted hidden sm:inline">
            Active line: <strong className="text-accent-primary">{activeLine}</strong>
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="clay-button p-1.5 text-xs text-txt-secondary hover:text-txt-primary flex items-center gap-1"
            title="Copy pseudocode"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="text-[10px] hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Listing */}
      {!isCollapsed && (
        <div className="mt-3 clay-inset p-3 sm:p-4 overflow-x-auto text-xs font-mono">
          <div className="min-w-[450px] space-y-0.5">
            {lines.map((line) => {
              const isActive = line.lineNumber === activeLine;
              return (
                <div
                  key={line.lineNumber}
                  className={`flex items-center px-2 py-0.5 rounded transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-500/25 text-purple-200 border-l-2 border-accent-primary font-semibold'
                      : 'text-txt-secondary hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Line Number */}
                  <span
                    className={`w-7 text-right pr-3 select-none text-[11px] ${
                      isActive ? 'text-accent-primary font-bold' : 'text-txt-muted'
                    }`}
                  >
                    {line.lineNumber}
                  </span>

                  {/* Code Text with Indentation */}
                  <span
                    className="whitespace-pre flex-1"
                    style={{ paddingLeft: `${line.indent * 1.25}rem` }}
                  >
                    {line.code}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
