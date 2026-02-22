import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Plus, Minus, ArrowLeft, Loader2, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
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
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/logo.dim_256x256.png';
                }}
              />
            </div>
          </Card>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{item.name}</h1>
              <Badge variant="secondary" className="text-xl font-bold px-4 py-2">
                ${priceInDollars}
              </Badge>
            </div>

            <div className="pt-4">
              <h2 className="text-lg font-semibold text-foreground mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Quantity Selector */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Quantity</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-8">
            <Button
              size="lg"
              className="w-full text-lg py-6"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
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
          </div>
        </div>
      </div>
    </div>
  );
}
