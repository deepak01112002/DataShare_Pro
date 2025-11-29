import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Database, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isAdmin = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">DataShare Pro</h1>
            </div>
            
            <nav className="flex gap-1 sm:gap-2 items-center flex-wrap">
              {/* Show Home link only on user pages (not admin pages) */}
              {!isAdmin && (
                <Link
                  to="/"
                  className={cn(
                    "px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base",
                    "bg-primary text-primary-foreground shadow-md"
                  )}
                >
                  Home
                </Link>
              )}
              
              {/* Show Back to Home and Logout when admin is logged in */}
              {isAuthenticated && isAdmin && (
                <>
                  <Link
                    to="/"
                    className={cn(
                      "px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base",
                      "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    Back to Home
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="ml-1 sm:ml-2 text-xs sm:text-sm"
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
};
