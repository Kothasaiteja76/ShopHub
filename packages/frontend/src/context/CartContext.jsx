import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      const { data } = await API.get("/api/cart");
      setCart(data.cart);
      setCartCount(data.cart.items.reduce((sum, i) => sum + i.quantity, 0));
    } catch {
      setCart(null);
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
    else { setCart(null); setCartCount(0); }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await API.post("/api/cart", { productId, quantity });
    setCart(data.cart);
    setCartCount(data.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  };

  const updateCartItem = async (productId, quantity) => {
    const { data } = await API.put(`/api/cart/${productId}`, { quantity });
    setCart(data.cart);
    setCartCount(data.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  };

  const removeFromCart = async (productId) => {
    const { data } = await API.delete(`/api/cart/${productId}`);
    setCart(data.cart);
    setCartCount(data.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  };

  const clearCart = async () => {
    await API.delete("/api/cart");
    setCart(null);
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);