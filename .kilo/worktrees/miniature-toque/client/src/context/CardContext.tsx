import { Children, createContext, useContext, useEffect, useState } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    cartOpen: boolean;
    setCartOpen: (open: boolean) => void;
}
const cartContext = createContext<CartContextType | undefined>(undefined);
// export default cartContext;
export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('app-cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [cartOpen, setCartOpen] = useState(false);
    useEffect(() => {
        localStorage.setItem('app-cart', JSON.stringify(items));
    }, [items]);
    const addToCart = (product: Product, quantity: number) => {
        setItems(prev => {
            const existing = prev.find(item => item.product._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item.product._id === product._id
                        ? {
                              ...item,
                              quantity: item.quantity + quantity,
                          }
                        : item,
                );
            }
            return [...prev, { product, quantity }];
        });
        setCartOpen(true);
    };
    const removeFromCart = (productId: string) => {
        setItems(prev => prev.filter(item => item.product._id !== productId));
    };
    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems(prev => prev.map(item => (item.product._id === productId ? { ...item, quantity } : item)));
    };
    const clearCart = () => {
        setItems([]);
        setCartOpen(false);
    };
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return <cartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, cartOpen, setCartOpen }}>{children}</cartContext.Provider>;
}

export function useCart() {
    const context = useContext(cartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
