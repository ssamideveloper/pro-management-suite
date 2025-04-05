
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface OrderItem {
  id: string;
  productId: number;
  product: Product;
  quantity: number;
  orderedAt: string;
}

interface ProductContextType {
  products: Product[];
  isLoadingProducts: boolean;
  filteredProducts: Product[];
  categories: string[];
  orders: OrderItem[];
  searchTerm: string;
  selectedCategory: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  addToOrders: (product: Product, quantity: number) => void;
  removeFromOrders: (orderId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        
        // Extract unique categories and explicitly cast to string[] to fix the type error
        const uniqueCategories = [...new Set(data.map((product: Product) => product.category))] as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('productOrders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error parsing saved orders:', error);
      }
    }
  }, []);

  // Filter products based on search term and category
  useEffect(() => {
    let result = products;
    
    if (searchTerm) {
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  // Add a product to orders
  const addToOrders = (product: Product, quantity: number) => {
    const newOrder: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      product,
      quantity,
      orderedAt: new Date().toISOString(),
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('productOrders', JSON.stringify(updatedOrders));
    toast.success(`Added ${product.title} to orders`);
  };

  // Remove a product from orders
  const removeFromOrders = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('productOrders', JSON.stringify(updatedOrders));
    toast.success('Order removed');
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoadingProducts,
        filteredProducts,
        categories,
        orders,
        searchTerm,
        selectedCategory,
        setSearchTerm,
        setSelectedCategory,
        addToOrders,
        removeFromOrders
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
