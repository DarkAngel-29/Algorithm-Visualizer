import React from 'react';

export const Legend: React.FC = () => {
  const items = [
    { label: 'Default', bg: 'bg-[#374151]', border: 'border-slate-500/40' },
    { label: 'Left Subarray', bg: 'bg-[#818CF8]', border: 'border-indigo-400' },
    { label: 'Right Subarray', bg: 'bg-[#38BDF8]', border: 'border-sky-400' },
    { label: 'Comparing', bg: 'bg-[#67E8F9]', border: 'border-cyan-300' },
    { label: 'Writing / Output', bg: 'bg-[#FBBF24]', border: 'border-amber-300' },
    { label: 'Sorted Segment', bg: 'bg-[#4ADE80]', border: 'border-green-400' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 text-[11px] text-txt-secondary border-t border-white/5">
      <span className="font-mono text-txt-muted text-[10px] uppercase tracking-wider">
        State Legend:
      </span>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className={`w-3 h-3 rounded-sm ${item.bg} border ${item.border} shadow-sm inline-block`}
          />
          <span className="font-medium text-txt-secondary">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
