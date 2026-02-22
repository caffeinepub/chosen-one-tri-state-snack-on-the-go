import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Plus, Minus, ArrowLeft, Loader2, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSnackItem, useAddToCart } from '../hooks/useQueries';
import { useUserId } from '../hooks/useCart';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams({ from: '/product/$id' });
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const userId = useUserId();
  const { data: item, isLoading, error } = useGetSnackItem(id);
  const addToCart = useAddToCart();

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    if (!userId) {
      toast.error('Please wait while we set up your cart');
      return;
    }

    if (!item) {
      toast.error('Item not found');
      return;
    }

    addToCart.mutate(
      { userId, itemId: item.id, quantity: BigInt(quantity) },
      {
        onSuccess: () => {
          toast.success(`Added ${quantity} ${item.name} to cart!`);
          navigate({ to: '/cart' });
        },
        onError: (error) => {
          toast.error(`Failed to add to cart: ${error.message}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground">Item not found</p>
          <Button
            onClick={() => navigate({ to: '/' })}
            className="mt-4"
          >
            Return to Catalog
          </Button>
        </Card>
      </div>
    );
  }

  const priceInDollars = (Number(item.price) / 100).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-6 hover:bg-primary/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Catalog
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative">
          <Card className="overflow-hidden border-2 border-border/50">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src={item.image.getDirectURL()}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
          </Card>
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-3 font-['Pacifico']">
              {item.name}
            </h1>
            <Badge variant="secondary" className="text-2xl font-bold px-4 py-2">
              ${priceInDollars}
            </Badge>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-base text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Quantity
              </label>
              <div className="flex items-center border-2 border-border rounded-lg overflow-hidden w-fit">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none hover:bg-primary/10"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="px-6 font-bold text-lg min-w-[4rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none hover:bg-primary/10"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full text-lg h-14 font-semibold"
              onClick={handleAddToCart}
              disabled={addToCart.isPending || !userId}
            >
              {addToCart.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Adding to Cart...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </>
              )}
            </Button>

            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Total:</strong> $
                {(Number(item.price) * quantity / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
