import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CartItem as CartItemType } from '../backend';

interface CartItemProps {
  item: CartItemType;
  onRemove?: () => void;
}

export default function CartItem({ item }: CartItemProps) {
  const priceInDollars = (Number(item.item.price) / 100).toFixed(2);
  const subtotal = ((Number(item.item.price) * Number(item.quantity)) / 100).toFixed(2);

  return (
    <Card className="overflow-hidden border-2 border-border/50">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <img
              src={item.item.image.getDirectURL()}
              alt={item.item.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1 truncate">{item.item.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">${priceInDollars} each</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Qty: {item.quantity.toString()}</span>
              <span className="font-bold text-primary">${subtotal}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
