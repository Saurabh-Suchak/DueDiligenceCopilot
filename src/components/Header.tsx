import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, FileText } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Upload Docs', path: '/upload' },
  { name: 'Q&A', path: '/qa' },
  { name: 'Red Flags', path: '/red-flags' },
  { name: 'Reports', path: '/reports' },
];

export function Header() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
              Due Diligence Copilot
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                  location.pathname === item.path
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
