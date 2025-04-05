
import { useRef } from 'react';
import { useProduct, OrderItem } from '@/contexts/ProductContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Download, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// We need to add jsPDF types for the autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const Orders = () => {
  const { orders, removeFromOrders } = useProduct();
  const confirmDeleteRef = useRef<HTMLButtonElement>(null);
  
  const handleDeleteOrder = (orderId: string) => {
    removeFromOrders(orderId);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const calculateTotal = () => {
    return orders.reduce((sum, order) => {
      return sum + (order.product.price * order.quantity);
    }, 0);
  };

  const downloadPdfReport = () => {
    const doc = new jsPDF();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    // Add headers
    doc.setFontSize(20);
    doc.text('Orders Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${now.toLocaleString()}`, 14, 32);
    doc.text(`Total Orders: ${orders.length}`, 14, 38);
    doc.text(`Total Value: $${calculateTotal().toFixed(2)}`, 14, 44);
    
    // Add table
    const tableColumn = ["Product", "Price", "Quantity", "Total", "Date"];
    const tableRows = orders.map(order => {
      return [
        order.product.title.substring(0, 30) + (order.product.title.length > 30 ? '...' : ''),
        `$${order.product.price.toFixed(2)}`,
        order.quantity.toString(),
        `$${(order.product.price * order.quantity).toFixed(2)}`,
        formatDate(order.orderedAt)
      ];
    });
    
    // Add an extra row for the grand total
    tableRows.push([
      'GRAND TOTAL',
      '',
      '',
      `$${calculateTotal().toFixed(2)}`,
      ''
    ]);
    
    doc.autoTable({
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255
      },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
    });
    
    doc.save(`orders-report-${dateStr}.pdf`);
    toast.success('Orders report downloaded successfully!');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">
              View and manage your product orders
            </p>
          </div>
          
          {orders.length > 0 && (
            <Button onClick={downloadPdfReport} className="ml-auto">
              <Download className="h-4 w-4 mr-2" /> Download Report
            </Button>
          )}
        </div>
        
        {orders.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded overflow-hidden bg-muted">
                        <img 
                          src={order.product.image} 
                          alt={order.product.title} 
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{order.product.title}</TableCell>
                    <TableCell>${order.product.price.toFixed(2)}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>${(order.product.price * order.quantity).toFixed(2)}</TableCell>
                    <TableCell>{formatDate(order.orderedAt)}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Order</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this order? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              ref={confirmDeleteRef}
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-medium">
                    Grand Total:
                  </TableCell>
                  <TableCell className="font-bold">
                    ${calculateTotal().toFixed(2)}
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              You haven't placed any orders yet. Browse products to add items to your orders.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/products'}>
              Browse Products
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;
