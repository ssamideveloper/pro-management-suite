
import { useEffect, useState } from 'react';
import { useProduct } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';
import { Package, ShoppingCart, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { products, orders } = useProduct();
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  useEffect(() => {
    // Calculate total revenue from orders
    const revenue = orders.reduce((sum, order) => {
      return sum + (order.product.price * order.quantity);
    }, 0);
    
    setTotalRevenue(revenue);
  }, [orders]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your product dashboard
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                Available in your catalog
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Orders Placed
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">
                Total orders you've placed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Spent
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Value of all your orders
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Your most recent product orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center">
                      <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                        <img 
                          src={order.product.image} 
                          alt={order.product.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{order.product.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {order.quantity} · ${(order.product.price * order.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  <p>No orders placed yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Popular Categories</CardTitle>
              <CardDescription>
                Top product categories in your catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <div className="space-y-4">
                  {[...new Set(products.map(p => p.category))].slice(0, 5).map((category) => {
                    const count = products.filter(p => p.category === category).length;
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <p className="text-sm font-medium capitalize">{category}</p>
                        <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md">
                          {count} {count === 1 ? 'product' : 'products'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  <p>No products available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
