
import { useState } from 'react';
import { useProduct } from '@/contexts/ProductContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Star, Plus, X } from 'lucide-react';

const Products = () => {
  const {
    filteredProducts,
    isLoadingProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    addToOrders,
  } = useProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToOrders = () => {
    if (selectedProduct && quantity > 0) {
      addToOrders(selectedProduct, quantity);
      setDialogOpen(false);
      setQuantity(1);
    }
  };

  const openOrderDialog = (product: any) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Browse products from our catalog
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:flex lg:items-center">
          <div className="relative lg:flex-1">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-40 md:w-48 lg:w-52">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCategory('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {isLoadingProducts ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="h-48 skeleton"></div>
                <div className="mt-2 h-4 w-3/4 skeleton"></div>
                <div className="mt-1 h-4 w-1/2 skeleton"></div>
                <div className="mt-auto pt-2 h-8 skeleton"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden">
                <div className="h-48 bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg truncate">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <span>${product.price.toFixed(2)}</span>
                    <span className="flex items-center text-accent ml-auto">
                      <Star className="h-3 w-3 fill-accent" />
                      <span className="ml-1 text-xs">
                        {product.rating.rate} ({product.rating.count})
                      </span>
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4 mt-auto">
                  <Button
                    className="w-full"
                    onClick={() => openOrderDialog(product)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add to orders
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-16 w-16 text-muted-foreground">
              <Search className="h-16 w-16 stroke-1" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Orders</DialogTitle>
            <DialogDescription>
              Enter the quantity for this order
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="flex items-start gap-4 py-4">
              <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedProduct.title}</h3>
                <p className="text-sm text-muted-foreground">
                  ${selectedProduct.price.toFixed(2)} per item
                </p>
              </div>
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="quantity" className="text-right text-sm">
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                className="col-span-3"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            {selectedProduct && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right text-sm">Total</span>
                <div className="col-span-3 font-medium">
                  ${(selectedProduct.price * quantity).toFixed(2)}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToOrders}>Confirm Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Products;
