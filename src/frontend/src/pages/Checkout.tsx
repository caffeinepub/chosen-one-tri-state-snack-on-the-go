import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGetCart, useCheckout } from '../hooks/useQueries';
import { useUserId } from '../hooks/useCart';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const userId = useUserId();
  const { data: cartItems = [] } = useGetCart(userId);
  const checkout = useCheckout();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    customerPhone: '',
  });

  const total = cartItems.reduce((sum, item) => {
    return sum + Number(item.item.price) * Number(item.quantity);
  }, 0);

  const totalInDollars = (total / 100).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail || !formData.customerAddress || !formData.customerPhone) {
      toast.error('Please fill in all fields');
      return;
    }

    checkout.mutate(
      {
        userId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerAddress: formData.customerAddress,
        customerPhone: formData.customerPhone,
      },
      {
        onSuccess: (orderId) => {
          toast.success('Order placed successfully!');
          navigate({ to: `/order-confirmation/${orderId.toString()}` });
        },
        onError: (error) => {
          toast.error(`Failed to place order: ${error.message}`);
        },
      }
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="py-16 text-center">
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some items before checking out
              </p>
              <Button onClick={() => navigate({ to: '/' })}>
                Browse Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, customerEmail: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, customerPhone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State"
                    value={formData.customerAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, customerAddress: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={checkout.isPending}
                >
                  {checkout.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div key={`${item.item.id}-${index}`} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.item.name} × {item.quantity.toString()}
                    </span>
                    <span className="font-medium">
                      ${((Number(item.item.price) * Number(item.quantity)) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">${totalInDollars}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
