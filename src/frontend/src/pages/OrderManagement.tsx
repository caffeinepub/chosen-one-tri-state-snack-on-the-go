import { ClipboardList, Package, User, Mail, MapPin, Phone, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAdminOrderManagement } from '../hooks/useQueries';

export default function OrderManagement() {
  const { data: orders = [], isLoading } = useAdminOrderManagement();

  return (
    <div className="container px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Order Management</h1>
        </div>
        <p className="text-muted-foreground">
          View and manage all customer orders
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground">
              Orders will appear here once customers start placing them
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const tipAmount = order.tip ? Number(order.tip) : 0;
            const subtotal = Number(order.totalAmount) - tipAmount;
            const subtotalInDollars = (subtotal / 100).toFixed(2);
            const tipInDollars = (tipAmount / 100).toFixed(2);
            const totalInDollars = (Number(order.totalAmount) / 100).toFixed(2);

            return (
              <Card key={order.id.toString()} className="border-2 border-border/50">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Order #{order.id.toString()}
                    </CardTitle>
                    <Badge variant="secondary" className="font-mono">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Customer Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Customer Details
                      </h3>
                      <div className="space-y-3 pl-7">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            Phone (for pickup)
                          </p>
                          <p className="font-bold text-primary text-lg">{order.customerPhone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            Email
                          </p>
                          <p className="font-medium">{order.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            Address
                          </p>
                          <p className="font-medium">{order.customerAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Order Items
                      </h3>
                      <ScrollArea className="h-[200px] rounded-md border border-border/50 p-4">
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-start p-3 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-start gap-2">
                                <Badge variant="outline" className="mt-0.5">
                                  {item.quantity.toString()}×
                                </Badge>
                                <div>
                                  <p className="font-semibold">{item.item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ${(Number(item.item.price) / 100).toFixed(2)} each
                                  </p>
                                </div>
                              </div>
                              <p className="font-bold text-primary">
                                ${((Number(item.item.price) * Number(item.quantity)) / 100).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">${subtotalInDollars}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            Tip
                          </span>
                          <span className={`font-medium ${tipAmount > 0 ? 'text-primary' : ''}`}>
                            {tipAmount > 0 ? `$${tipInDollars}` : 'No tip'}
                          </span>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                          <span className="font-bold text-lg">Total</span>
                          <span className="font-bold text-xl text-primary">${totalInDollars}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
