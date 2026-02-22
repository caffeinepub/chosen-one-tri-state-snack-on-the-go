import { useState } from 'react';
import { Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { SnackItem } from '../backend';
import { useAddToCart, useDeleteSnackItem } from '../hooks/useQueries';
import { useUserId } from '../hooks/useCart';
import { toast } from 'sonner';

interface ProductCardProps {
  item: SnackItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const userId = useUserId();
  const addToCart = useAddToCart();
  const deleteSnackItem = useDeleteSnackItem();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddToCart = () => {
    if (!userId) {
      toast.error('Please wait while we set up your cart');
      return;
    }

    addToCart.mutate(
      { userId, itemId: item.id, quantity: BigInt(quantity) },
      {
        onSuccess: () => {
          toast.success(`Added ${quantity} ${item.name} to cart!`);
          setQuantity(1);
        },
        onError: (error) => {
          toast.error(`Failed to add to cart: ${error.message}`);
        },
      }
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSnackItem.mutateAsync(item.id);
      toast.success(`${item.name} has been deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete snack item');
    } finally {
      setIsDeleting(false);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const priceInDollars = (Number(item.price) / 100).toFixed(2);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 border-border/50 hover:border-primary/30">
      <CardHeader className="p-0 relative">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={item.image.getDirectURL()}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="absolute top-2 right-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 shadow-lg"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <strong>{item.name}</strong> from the catalog. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 text-foreground">{item.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
        <Badge variant="secondary" className="text-base font-bold px-3 py-1">
          ${priceInDollars}
        </Badge>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center gap-2">
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 font-semibold text-sm min-w-[3rem] text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={incrementQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="flex-1"
          onClick={handleAddToCart}
          disabled={addToCart.isPending || !userId}
        >
          {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
