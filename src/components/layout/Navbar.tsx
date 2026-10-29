import React, { useState } from 'react';
import { Layers, Sparkles, Sliders, Check, Info } from 'lucide-react';

interface NavbarProps {
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [showAlgorithmsModal, setShowAlgorithmsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <header className="w-full border-b border-white/5 bg-[#14171E] sticky top-0 z-40 px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-clay-sm bg-[#282D38] border border-white/10 flex items-center justify-center shadow-clay-btn">
              <Layers className="w-5 h-5 text-accent-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-txt-primary flex items-center gap-1.5 font-sans">
                AlgoLab
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                  v1.0
                </span>
              </span>
              <span className="text-xs text-txt-muted font-medium">Interactive Learning Platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <button
              className="px-3.5 py-1.5 rounded-clay-sm text-sm font-medium bg-[#282D38] text-txt-primary border border-white/10 shadow-clay-btn flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-accent-secondary" />
              <span>Visualizer</span>
            </button>

            <button
              onClick={() => setShowAlgorithmsModal(true)}
              className="px-3.5 py-1.5 rounded-clay-sm text-sm font-medium text-txt-secondary hover:text-txt-primary hover:bg-[#20242D] border border-transparent hover:border-white/5 transition-all flex items-center gap-1.5"
            >
              <span>Algorithms</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                1
              </span>
            </button>

            <button
              onClick={() => setShowInfoModal(true)}
              title="Platform Details"
              className="w-9 h-9 rounded-clay-sm bg-[#20242D] hover:bg-[#282D38] text-txt-secondary hover:text-txt-primary border border-white/5 flex items-center justify-center shadow-clay-card transition-all"
            >
              <Info className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Available Algorithms Modal */}
      {showAlgorithmsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="clay-surface-elevated p-6 max-w-md w-full rounded-clay-lg relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-semibold text-txt-primary flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent-primary" />
                Algorithm Modules
              </h3>
              <button
                onClick={() => setShowAlgorithmsModal(false)}
                className="text-txt-muted hover:text-txt-primary text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-clay-sm bg-[#20242D] border border-accent-primary/40 shadow-clay-card flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-txt-primary">Merge Sort</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Active
                    </span>
                  </div>
                  <p className="text-xs text-txt-secondary mt-1">
                    Divide and conquer recursive sorting algorithm (O(n log n)).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-clay-sm bg-[#181B22] border border-white/5 opacity-60 flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm text-txt-muted">Quick Sort, Heap Sort & Graphs</span>
                  <p className="text-xs text-txt-muted mt-0.5">
                    Modular expansion architecture ready for future modules.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-txt-muted bg-white/5 px-2 py-0.5 rounded">
                  Upcoming
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAlgorithmsModal(false)}
                className="clay-button px-4 py-1.5 text-xs text-txt-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="clay-surface-elevated p-6 max-w-lg w-full rounded-clay-lg relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-semibold text-txt-primary flex items-center gap-2">
                <Info className="w-4 h-4 text-accent-secondary" />
                About AlgoLab
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-txt-muted hover:text-txt-primary text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 text-sm text-txt-secondary space-y-3 leading-relaxed">
              <p>
                AlgoLab is an interactive, educational algorithm visualizer designed to demystify complex computational algorithms through deterministic step execution and responsive claymorphism aesthetics.
              </p>
              <div className="p-3 rounded-clay-sm bg-[#1C2029] border border-white/5 space-y-1.5 text-xs">
                <div className="font-semibold text-txt-primary">Keyboard Shortcuts:</div>
                <div className="grid grid-cols-2 gap-2 text-txt-muted">
                  <div><kbd className="px-1.5 py-0.5 rounded bg-black/40 text-txt-primary font-mono">Space</kbd> Play / Pause</div>
                  <div><kbd className="px-1.5 py-0.5 rounded bg-black/40 text-txt-primary font-mono">→</kbd> Next Step</div>
                  <div><kbd className="px-1.5 py-0.5 rounded bg-black/40 text-txt-primary font-mono">←</kbd> Previous Step</div>
                  <div><kbd className="px-1.5 py-0.5 rounded bg-black/40 text-txt-primary font-mono">R</kbd> Reset to Initial</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="clay-button px-4 py-1.5 text-xs text-txt-primary"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
