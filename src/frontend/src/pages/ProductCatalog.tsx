import { Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useGetAllSnackItems } from '../hooks/useQueries';

export default function ProductCatalog() {
  const { data: snackItems = [], isLoading } = useGetAllSnackItems();

  return (
    <div className="container px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50">
        <div className="relative">
          <img
            src="/assets/generated/hero-banner.dim_1400x500.png"
            alt="Delicious Snacks"
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-end">
            <div className="p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Fresh Snacks on Wheels!
              </h2>
              <p className="text-lg text-foreground/90 max-w-2xl">
                Serving the tri-state area with the best snacks on the go
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Truck Image */}
      <section className="mb-12 flex justify-center">
        <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-border/50 max-w-3xl">
          <img
            src="/assets/generated/food-truck.dim_1200x600.png"
            alt="Our Food Truck"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Products Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Our Menu</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : snackItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">No snacks available yet</p>
            <p className="text-sm text-muted-foreground">Check back soon for delicious treats!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {snackItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
