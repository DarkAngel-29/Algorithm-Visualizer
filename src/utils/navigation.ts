import React from 'react';
import {
  Layers,
  Crown,
  Database,
  Grid,
  GitBranch,
  Network,
  Search,
} from 'lucide-react';

export interface NavAlgorithmItem {
  id: string;
  name: string;
  category: string;
  route: string;
  icon: React.ReactNode;
}

export const NAV_ALGORITHMS: NavAlgorithmItem[] = [
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Sorting',
    route: 'merge-sort',
    icon: React.createElement(Layers, { className: 'w-4 h-4 text-accent-primary' }),
  },
  {
    id: 'n-queens',
    name: 'N-Queens Backtracking',
    category: 'Backtracking',
    route: 'n-queens',
    icon: React.createElement(Crown, { className: 'w-4 h-4 text-amber-400' }),
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    category: 'Dynamic Programming',
    route: 'knapsack',
    icon: React.createElement(Database, { className: 'w-4 h-4 text-cyan-400' }),
  },
  {
    id: 'matrix',
    name: 'Matrix Multiplication',
    category: 'Matrix Operations',
    route: 'matrix',
    icon: React.createElement(Grid, { className: 'w-4 h-4 text-purple-400' }),
  },
  {
    id: 'max-flow',
    name: 'Maximum Flow',
    category: 'Network Flow',
    route: 'max-flow',
    icon: React.createElement(GitBranch, { className: 'w-4 h-4 text-emerald-400' }),
  },
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford Shortest Path',
    category: 'Graph Algorithms',
    route: 'bellman-ford',
    icon: React.createElement(Network, { className: 'w-4 h-4 text-sky-400' }),
  },
  {
    id: 'kmp',
    name: 'LPS + KMP String Search',
    category: 'String Algorithms',
    route: 'kmp',
    icon: React.createElement(Search, { className: 'w-4 h-4 text-pink-400' }),
  },
];
