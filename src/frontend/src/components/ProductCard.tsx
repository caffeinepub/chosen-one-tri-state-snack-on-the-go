import { useNavigate } from '@tanstack/react-router';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SnackItem } from '../backend';

interface ProductCardProps {
  item: SnackItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate({ to: '/product/$id', params: { id: item.id } });
  };

  const priceInDollars = (Number(item.price) / 100).toFixed(2);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 border-border/50 hover:border-primary/30">
      <CardHeader className="p-0 relative">
        <div className="aspect-square overflow-hidden bg-muted cursor-pointer" onClick={handleViewDetails}>
          <img
            src={item.image.getDirectURL()}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/assets/logo.dim_256x256.png';
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 cursor-pointer" onClick={handleViewDetails}>
        <CardTitle className="text-lg mb-2 text-foreground">{item.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
        <Badge variant="secondary" className="text-base font-bold px-3 py-1">
          ${priceInDollars}
        </Badge>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleViewDetails}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
