import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, DollarSign } from 'lucide-react';
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

  const [tipOption, setTipOption] = useState<'none' | '10' | '15' | '20' | 'custom'>('none');
  const [customTip, setCustomTip] = useState('');

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.item.price) * Number(item.quantity);
  }, 0);

  const calculateTip = (): number => {
    if (tipOption === 'none') return 0;
    if (tipOption === 'custom') {
      const amount = parseFloat(customTip) || 0;
      return Math.round(amount * 100); // Convert to cents
    }
    const percentage = parseInt(tipOption) / 100;
    return Math.round(subtotal * percentage);
  };

  const tipAmount = calculateTip();
  const total = subtotal + tipAmount;

  const subtotalInDollars = (subtotal / 100).toFixed(2);
  const tipInDollars = (tipAmount / 100).toFixed(2);
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
        tip: tipAmount > 0 ? BigInt(tipAmount) : null,
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
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <Label className="text-base font-semibold">Add a Tip</Label>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    type="button"
                    variant={tipOption === '10' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setTipOption('10');
                      setCustomTip('');
                    }}
                  >
                    10%
                  </Button>
                  <Button
                    type="button"
                    variant={tipOption === '15' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setTipOption('15');
                      setCustomTip('');
                    }}
                  >
                    15%
                  </Button>
                  <Button
                    type="button"
                    variant={tipOption === '20' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setTipOption('20');
                      setCustomTip('');
                    }}
                  >
                    20%
                  </Button>
                  <Button
                    type="button"
                    variant={tipOption === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTipOption('custom')}
                  >
                    Custom
                  </Button>
                </div>

                {tipOption === 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="customTip" className="text-sm">Custom Tip Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="customTip"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={customTip}
                        onChange={(e) => setCustomTip(e.target.value)}
                        className="pl-7"
                      />
                    </div>
                  </div>
                )}

                {tipOption !== 'none' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTipOption('none');
                      setCustomTip('');
                    }}
                    className="w-full"
                  >
                    No Tip
                  </Button>
                )}
              </div>

              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotalInDollars}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tip</span>
                    <span className="font-medium text-primary">${tipInDollars}</span>
                  </div>
                )}
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
