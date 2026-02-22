import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetCart } from '../hooks/useQueries';
import { useUserId } from '../hooks/useCart';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const userId = useUserId();
  const { data: cartItems = [] } = useGetCart(userId);

  const cartItemCount = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/assets/generated/logo.dim_256x256.png" 
              alt="Chosen One Logo" 
              className="h-10 w-10 rounded-full shadow-md"
            />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight text-primary tracking-tight">
                Chosen One
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Tri-State Snack on the Go</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/admin' })}
              title="Admin"
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => navigate({ to: '/cart' })}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
        <div className="container px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Chosen One Tri-State Snack on the Go. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
