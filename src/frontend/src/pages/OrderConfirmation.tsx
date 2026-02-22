import { useParams, useNavigate } from '@tanstack/react-router';
import { CheckCircle2, ArrowRight, Package, User, Mail, MapPin, Phone, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetOrder } from '../hooks/useQueries';

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="py-16 text-center">
              <h2 className="text-xl font-semibold mb-2">Order not found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find the order you're looking for
              </p>
              <Button onClick={() => navigate({ to: '/' })}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const tipAmount = order.tip ? Number(order.tip) : 0;
  const subtotal = Number(order.totalAmount) - tipAmount;
  const subtotalInDollars = (subtotal / 100).toFixed(2);
  const tipInDollars = (tipAmount / 100).toFixed(2);
  const totalInDollars = (Number(order.totalAmount) / 100).toFixed(2);

  return (
    <div className="container px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Alert className="border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/10">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertTitle className="text-xl font-bold text-primary">Order Confirmed!</AlertTitle>
          <AlertDescription className="text-base mt-2">
            Thank you for your order. Your order number is <span className="font-bold">#{order.id.toString()}</span>
          </AlertDescription>
        </Alert>

        <Card className="border-2 border-border/50">
          <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name
                </p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </p>
                <p className="font-medium text-primary">{order.customerPhone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </p>
                <p className="font-medium">{order.customerAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border/50">
          <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-muted/50 to-accent/5 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-mono">
                      {item.quantity.toString()}×
                    </Badge>
                    <div>
                      <p className="font-semibold">{item.item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.item.description}</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">
                    ${((Number(item.item.price) * Number(item.quantity)) / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotalInDollars}</span>
              </div>
              
              {tipAmount > 0 && (
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Tip
                  </span>
                  <span className="font-medium text-primary">${tipInDollars}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">${totalInDollars}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={() => navigate({ to: '/' })}
            className="gap-2"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
