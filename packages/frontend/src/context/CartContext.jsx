import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext({
  cart: null,
  cartCount: 0,
  fetchCart: () => {},
  addToCart: () => {},
  updateCartItem: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const updateCount = (cartData) => {
    if (cartData && cartData.items && cartData.items.length > 0) {
      const count = cartData.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  };

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await API.get("/api/cart");
      if (data.success) {
        setCart(data.cart);
        updateCount(data.cart);
      }
    } catch (error) {
      setCart(null);
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
      setCartCount(0);
    }
  }, [user, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await API.post("/api/cart", {
        productId: productId.toString(),
        quantity: Number(quantity),
      });
      if (data.success) {
        setCart(data.cart);
        updateCount(data.cart);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const { data } = await API.put(`/api/cart/${productId}`, {
        quantity: Number(quantity),
      });
      if (data.success) {
        setCart(data.cart);
        updateCount(data.cart);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.delete(`/api/cart/${productId}`);
      if (data.success) {
        setCart(data.cart);
        updateCount(data.cart);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await API.delete("/api/cart");
      setCart(null);
      setCartCount(0);
    } catch (error) {
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};