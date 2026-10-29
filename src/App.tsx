import { Navbar } from './components/layout/Navbar';
import { MergeSortPage } from './pages/MergeSortPage';
import { Code2, BookOpen } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen bg-[#111318] text-[#F3F4F6] flex flex-col selection:bg-purple-500/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <div className="flex-1">
        <MergeSortPage />
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-[#14171E] py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-txt-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-txt-primary">AlgoLab</span>
            <span>—</span>
            <span>Educational Algorithm Visualizer</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-txt-secondary">
              <Code2 className="w-3.5 h-3.5 text-accent-primary" />
              <span>Extensible Algorithm Engine</span>
            </span>
            <span className="flex items-center gap-1.5 text-txt-secondary">
              <BookOpen className="w-3.5 h-3.5 text-accent-secondary" />
              <span>Dark Claymorphism UI</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
