import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { Toaster } from './components/ui/sonner';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { QA } from './pages/QA';
import { RedFlags } from './pages/RedFlags';
import { Reports } from './pages/Reports';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="dd-copilot-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/qa" element={<QA />} />
              <Route path="/red-flags" element={<RedFlags />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
