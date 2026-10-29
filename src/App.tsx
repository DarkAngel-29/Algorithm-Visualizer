import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { MergeSortPage } from './pages/MergeSortPage';
import { NQueensPage } from './pages/NQueensPage';
import { KnapsackPage } from './pages/KnapsackPage';
import { MatrixChainPage } from './pages/MatrixChainPage';
import { MaxFlowPage } from './pages/MaxFlowPage';
import { BellmanFordPage } from './pages/BellmanFordPage';
import { KMPPage } from './pages/KMPPage';
import { AlgorithmsHubPage } from './pages/AlgorithmsHubPage';
import { Code2, BookOpen, Layers } from 'lucide-react';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'merge-sort';
  });

  // Sync hash changes with state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      setCurrentRoute(hash || 'merge-sort');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = `#/${route}`;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (currentRoute) {
      case 'n-queens':
        return <NQueensPage />;
      case 'knapsack':
        return <KnapsackPage />;
      case 'matrix':
        return <MatrixChainPage />;
      case 'max-flow':
        return <MaxFlowPage />;
      case 'bellman-ford':
        return <BellmanFordPage />;
      case 'kmp':
        return <KMPPage />;
      case 'hub':
      case 'algorithms':
        return <AlgorithmsHubPage onNavigate={navigateTo} />;
      case 'merge-sort':
      default:
        return <MergeSortPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#111318] text-[#F3F4F6] flex flex-col selection:bg-purple-500/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

      {/* Main Page Content */}
      <div className="flex-1">
        {renderActivePage()}
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-[#14171E] py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-txt-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-txt-primary">AlgoLab Platform</span>
            <span>—</span>
            <span>Interactive Multi-Algorithm Educational System</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo('hub')}
              className="flex items-center gap-1.5 text-txt-secondary hover:text-accent-primary transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-accent-primary" />
              <span>All 7 Algorithms</span>
            </button>
            <span className="flex items-center gap-1.5 text-txt-secondary">
              <Code2 className="w-3.5 h-3.5 text-accent-secondary" />
              <span>Extensible Engine</span>
            </span>
            <span className="flex items-center gap-1.5 text-txt-secondary">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dark Claymorphism</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
