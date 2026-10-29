import React from 'react';
import {
  Layers,
  Crown,
  Database,
  Grid,
  GitBranch,
  Network,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AlgorithmCardData {
  id: string;
  name: string;
  category: string;
  paradigm: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

interface AlgorithmsHubPageProps {
  onNavigate: (route: string) => void;
}

export const AlgorithmsHubPage: React.FC<AlgorithmsHubPageProps> = ({ onNavigate }) => {
  const algorithms: AlgorithmCardData[] = [
    {
      id: 'merge-sort',
      name: 'Merge Sort',
      category: 'Sorting Algorithms',
      paradigm: 'Divide and Conquer',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      description:
        'Recursively splits arrays in halves and merges sorted subsegments in linear time.',
      icon: <Layers className="w-5 h-5 text-accent-primary" />,
      route: 'merge-sort',
    },
    {
      id: 'n-queens',
      name: 'N-Queens Problem',
      category: 'Backtracking',
      paradigm: 'State-Space Backtracking',
      timeComplexity: 'O(N!)',
      spaceComplexity: 'O(N)',
      description:
        'Positions N chess queens safely on an N×N board using row-by-row candidate testing.',
      icon: <Crown className="w-5 h-5 text-amber-400" />,
      route: 'n-queens',
    },
    {
      id: 'knapsack-01',
      name: '0/1 Knapsack',
      category: 'Dynamic Programming',
      paradigm: 'Tabular Optimization',
      timeComplexity: 'O(n · W)',
      spaceComplexity: 'O(n · W)',
      description:
        'Fills a 2D DP matrix to evaluate optimal item choices then backtracks to recover optimal items.',
      icon: <Database className="w-5 h-5 text-cyan-400" />,
      route: 'knapsack',
    },
    {
      id: 'matrix-chain-multiplication',
      name: 'Matrix Chain Multiplication',
      category: 'Dynamic Programming',
      paradigm: 'Optimal Substructure DP',
      timeComplexity: 'O(n³)',
      spaceComplexity: 'O(n²)',
      description:
        'Determines the optimal parenthesization of a chain of matrices to minimize scalar operations.',
      icon: <Grid className="w-5 h-5 text-purple-400" />,
      route: 'matrix',
    },
    {
      id: 'max-flow',
      name: 'Maximum Flow (Edmonds-Karp)',
      category: 'Network Flow',
      paradigm: 'BFS Augmenting Paths',
      timeComplexity: 'O(V · E²)',
      spaceComplexity: 'O(V + E)',
      description:
        'Computes max capacity network throughput via shortest residual paths and identifies min-cut.',
      icon: <GitBranch className="w-5 h-5 text-emerald-400" />,
      route: 'max-flow',
    },
    {
      id: 'bellman-ford',
      name: 'Bellman-Ford Shortest Path',
      category: 'Graph Algorithms',
      paradigm: 'Edge Relaxation',
      timeComplexity: 'O(V · E)',
      spaceComplexity: 'O(V)',
      description:
        'Relaxes directed edges across |V| - 1 passes, handling negative weights and cycle traps.',
      icon: <Network className="w-5 h-5 text-sky-400" />,
      route: 'bellman-ford',
    },
    {
      id: 'kmp',
      name: 'LPS + KMP String Matching',
      category: 'String Algorithms',
      paradigm: 'Prefix Automaton',
      timeComplexity: 'O(m + n)',
      spaceComplexity: 'O(m)',
      description:
        'Precomputes Longest Proper Prefix-Suffix table and avoids text backtracking on mismatches.',
      icon: <Search className="w-5 h-5 text-pink-400" />,
      route: 'kmp',
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="clay-badge px-3 py-1 text-xs font-medium text-accent-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-secondary" />
                Curriculum Overview
              </span>
              <span className="clay-badge px-3 py-1 text-xs font-mono text-cyan-300">
                7 Algorithms Active
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-txt-primary">
              AlgoLab Algorithm Modules
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary mt-1 max-w-2xl">
              Explore purpose-built interactive visualizations designed to clarify computational complexity, state-space exploration, and algorithmic techniques.
            </p>
          </div>
        </div>
      </section>

      {/* Grid of Algorithm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {algorithms.map((algo) => (
          <div
            key={algo.id}
            onClick={() => onNavigate(algo.route)}
            className="clay-surface hover:clay-surface-elevated p-5 rounded-clay cursor-pointer transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-clay-sm bg-[#161920] border border-white/10 flex items-center justify-center shadow-clay-card group-hover:scale-105 transition-transform">
                  {algo.icon}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-txt-muted px-2 py-0.5 rounded bg-white/5 border border-white/5">
                  {algo.category}
                </span>
              </div>

              <h2 className="text-base font-bold text-txt-primary group-hover:text-accent-secondary transition-colors">
                {algo.name}
              </h2>
              <p className="text-xs text-txt-secondary mt-1.5 leading-relaxed line-clamp-2">
                {algo.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-mono text-txt-muted">
                <span className="text-cyan-300 font-semibold">{algo.timeComplexity}</span>
                <span>•</span>
                <span className="text-emerald-300">{algo.spaceComplexity}</span>
              </div>

              <span className="text-xs text-accent-primary group-hover:translate-x-1 transition-transform flex items-center gap-1 font-medium">
                Launch <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
