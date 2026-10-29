import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Check,
  Info,
  ChevronDown,
} from 'lucide-react';
import { NAV_ALGORITHMS } from '../../utils/navigation';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const activeAlgo = NAV_ALGORITHMS.find((a) => a.route === currentRoute);

  return (
    <>
      <header className="w-full border-b border-white/5 bg-[#14171E] sticky top-0 z-40 px-4 sm:px-8 py-3 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('hub')}
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-clay-sm bg-[#282D38] border border-white/10 flex items-center justify-center shadow-clay-btn group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-accent-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-txt-primary flex items-center gap-1.5 font-sans">
                AlgoLab
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                  v2.0
                </span>
              </span>
              <span className="text-xs text-txt-muted font-medium">Interactive Learning Platform</span>
            </div>
          </div>

          {/* Navigation Links & Quick Switcher */}
          <nav className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Algorithm Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-3 py-1.5 rounded-clay-sm text-xs sm:text-sm font-medium bg-[#282D38] text-txt-primary border border-white/10 shadow-clay-btn flex items-center gap-2 transition-all hover:bg-[#2F3542]"
              >
                {activeAlgo ? activeAlgo.icon : <Sparkles className="w-4 h-4 text-accent-secondary" />}
                <span className="max-w-[140px] sm:max-w-[200px] truncate">
                  {activeAlgo ? activeAlgo.name : 'Select Algorithm'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-txt-muted ml-0.5" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 clay-surface-elevated p-2 rounded-clay shadow-clay-elevated z-50 border border-white/10 animate-in fade-in">
                  <div className="text-[10px] font-mono text-txt-muted px-2 py-1 uppercase tracking-wider border-b border-white/5 mb-1">
                    Active Algorithms (7)
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {NAV_ALGORITHMS.map((algo) => {
                      const isCurrent = currentRoute === algo.route;
                      return (
                        <button
                          key={algo.id}
                          type="button"
                          onClick={() => {
                            onNavigate(algo.route);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                            isCurrent
                              ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30 font-semibold'
                              : 'text-txt-secondary hover:bg-white/5 hover:text-txt-primary'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {algo.icon}
                            <span className="truncate">{algo.name}</span>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Algorithms Hub Button */}
            <button
              onClick={() => onNavigate('hub')}
              className={`px-3 py-1.5 rounded-clay-sm text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentRoute === 'hub'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                  : 'text-txt-secondary hover:text-txt-primary hover:bg-[#20242D] border border-transparent'
              }`}
            >
              <span>Algorithms</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                7
              </span>
            </button>

            {/* Info / Shortcuts Button */}
            <button
              onClick={() => setShowInfoModal(true)}
              title="Platform Details & Shortcuts"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-clay-sm bg-[#20242D] hover:bg-[#282D38] text-txt-secondary hover:text-txt-primary border border-white/5 flex items-center justify-center shadow-clay-card transition-all"
            >
              <Info className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

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
                AlgoLab provides purpose-built animations for algorithms in sorting, backtracking, dynamic programming, matrix operations, network flow, shortest paths, and string matching.
              </p>
              <div className="p-3 rounded-clay-sm bg-[#1C2029] border border-white/5 space-y-1.5 text-xs">
                <div className="font-semibold text-txt-primary">Universal Keyboard Controls:</div>
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
