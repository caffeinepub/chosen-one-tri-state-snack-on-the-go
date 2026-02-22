import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { ShoppingCart, Settings, Package, ClipboardList, Info, Landmark } from 'lucide-react';
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
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

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
              variant={currentPath === '/about' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => navigate({ to: '/about' })}
              title="About"
            >
              <Info className="h-5 w-5" />
            </Button>

            <Button
              variant={currentPath === '/snacks' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => navigate({ to: '/snacks' })}
              title="Snacks"
            >
              <Package className="h-5 w-5" />
            </Button>

            <Button
              variant={currentPath === '/admin/orders' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => navigate({ to: '/admin/orders' })}
              title="Orders"
            >
              <ClipboardList className="h-5 w-5" />
            </Button>

            <Button
              variant={currentPath === '/admin/bank' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => navigate({ to: '/admin/bank' })}
              title="Bank Info"
            >
              <Landmark className="h-5 w-5" />
            </Button>

            <Button
              variant={currentPath === '/admin' ? 'default' : 'ghost'}
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

      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6 mt-12">
        <div className="container px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Chosen One. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
