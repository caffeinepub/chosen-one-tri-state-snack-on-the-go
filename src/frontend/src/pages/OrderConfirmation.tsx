import { useParams, useNavigate } from '@tanstack/react-router';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetOrder } from '../hooks/useQueries';

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground">Loading order details...</p>
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
              <Button onClick={() => navigate({ to: '/' })}>
                Return to Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalInDollars = (Number(order.totalAmount) / 100).toFixed(2);

  return (
    <div className="container px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-primary/30 shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle2 className="h-16 w-16 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">Order Confirmed!</CardTitle>
            <p className="text-muted-foreground">
              Thank you for your order. We'll prepare your snacks right away!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="text-2xl font-bold text-primary">#{order.id.toString()}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{order.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium text-right">{order.customerAddress}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.item.name} × {item.quantity.toString()}
                    </span>
                    <span className="font-medium">
                      ${((Number(item.item.price) * Number(item.quantity)) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-xl font-bold">
              <span>Total Paid</span>
              <span className="text-primary">${totalInDollars}</span>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate({ to: '/' })}
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
