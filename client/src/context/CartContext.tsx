import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productType, variantType } from '../types';

interface ICartContext{
    cartItems: CartItem[];
    addToCart: (item: productType, quantity: number, variant?: variantType) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    editItemQuantity: (itemId: string, action:'set'|'increment'|'decrement', quantity?:number) => void;
    total: number;
    isInCart: (itemId: string)=>boolean
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const cartAction = (items:CartItem[])=>{
    setTotal(items.reduce((total, item) => total + (item.product.discountPrice||item.product.basePrice) * item.quantity, 0))
    localStorage.setItem("cartItems_valeria", JSON.stringify(items));
  }

  const addToCart = (product: productType, quantity: number, variant?: variantType) => {
    if(!quantity){
        return toast.error("No quantity set")
    }
    if(!variant){
        return toast.error("No variant selected")
    }
    setCartItems((prevItems) => {
        const existingItem = prevItems.some((i) => i.product._id === product._id);
        
        if (existingItem) {
            toast.warn("Item already in cart")
            return prevItems
        } 

        const newItems = [...prevItems, { product, quantity, variant }];
        cartAction(newItems)
        toast.success("Added item to cart")
        return newItems
    });
  }

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.product._id !== itemId)
      cartAction(newItems)
      toast.success("Removed item from cart")
      return newItems
    });
  }

  const clearCart = () => {
    if(cartItems.length===0) return;
    setCartItems([]);
    cartAction([])
    localStorage.removeItem("cartItems_valeria");
    toast.success("Cleared cart successfully!")
  }

  const isInCart = (itemId:string)=>{
    return cartItems.some(item=>item.product._id===itemId)
  }

  const editItemQuantity = (itemId: string, action: 'increment'|'decrement'|'set', quantity?:number ) => {
        if(!quantity&&action==='set'){
            return toast.error('No quantity set')
        }

        setCartItems((prevItems) =>{
            const newItems = prevItems.map((item) => 
                item.product._id === itemId ? 
                    { ...item, 
                        quantity: 
                            (action==='set')? 
                                Math.max(1, quantity||1)
                            : action==='increment'?
                                item.quantity+1
                            : Math.max(1, item.quantity-1)
                    } 
                : item
            )
            cartAction(newItems)
            return newItems;
        });
  }
  
  useEffect(()=>{
    const items = localStorage.getItem("cartItems_valeria");
    const parsedItems:any[] = items ? JSON.parse(items) : []
    setCartItems(parsedItems);
    setTotal(parsedItems.reduce((total, item) => total + (item.product.discountPrice||item.product.basePrice) * item.quantity, 0))
  },[])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        editItemQuantity,
        total,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

