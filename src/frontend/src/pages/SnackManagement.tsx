import { Loader2, Package, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useGetAllSnackItems, useDeleteSnackItem } from '../hooks/useQueries';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SnackManagement() {
  const { data: snackItems = [], isLoading } = useGetAllSnackItems();
  const deleteSnackItem = useDeleteSnackItem();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      await deleteSnackItem.mutateAsync(id);
      toast.success(`${name} has been deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete snack item');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Snack Management</h1>
        </div>
        <p className="text-muted-foreground">View and manage all available snack items</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="aspect-square w-full" />
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : snackItems.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Snacks Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are no snack items in the catalog yet. Visit the Admin panel to add your first snack!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{snackItems.length}</span> snack{snackItems.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {snackItems.map((item) => (
              <Card 
                key={item.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-border/50 hover:border-primary/30"
              >
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={item.image.getDirectURL()}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 text-foreground line-clamp-1">
                    {item.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3 min-h-[3.75rem]">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-base font-bold px-3 py-1">
                      ${(Number(item.price) / 100).toFixed(2)}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      ID: {item.id}
                    </span>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full"
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Item
                          </>
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
                          onClick={() => handleDelete(item.id, item.name)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
