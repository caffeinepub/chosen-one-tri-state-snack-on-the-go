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
          <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
        </div>
        <p className="text-muted-foreground">View and manage all customer orders</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No customer orders have been placed yet. Orders will appear here once customers complete checkout.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Orders: <span className="font-semibold text-foreground">{orders.length}</span>
            </p>
            <Badge variant="secondary" className="text-sm">
              All orders confirmed
            </Badge>
          </div>

          <div className="space-y-6">
            {orders.map((order) => {
              const totalInDollars = (Number(order.totalAmount) / 100).toFixed(2);
              
              return (
                <Card 
                  key={order.id.toString()} 
                  className="overflow-hidden border-2 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Order #{order.id.toString()}</CardTitle>
                          <Badge variant="default" className="mt-1">
                            Confirmed
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold text-primary">${totalInDollars}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Customer Information
                          </h4>
                          <div className="space-y-2 pl-6">
                            <div className="flex items-start gap-2">
                              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">Name</p>
                                <p className="font-medium">{order.customerName}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="font-medium">{order.customerEmail}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">Phone (for pickup)</p>
                                <p className="font-medium text-primary text-lg">{order.customerPhone}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">Address</p>
                                <p className="font-medium">{order.customerAddress}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Order Items ({order.items.length})
                        </h4>
                        <ScrollArea className="h-[200px] rounded-md border border-border/50 bg-muted/20">
                          <div className="p-4 space-y-3">
                            {order.items.map((item, index) => (
                              <div 
                                key={index}
                                className="flex justify-between items-center p-2 bg-background rounded hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {item.quantity.toString()}×
                                  </Badge>
                                  <span className="text-sm font-medium">{item.item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-primary">
                                  ${((Number(item.item.price) * Number(item.quantity)) / 100).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex justify-between items-center p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                          <span className="font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Order Total
                          </span>
                          <span className="text-xl font-bold text-primary">${totalInDollars}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
