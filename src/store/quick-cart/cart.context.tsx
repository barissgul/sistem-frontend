'use client';

import { createContext, useContext } from 'react';

interface CartContextType {
  addItemToCart: (item: any) => void;
  removeItemFromCart: (id: string) => void;
  clearItemFromCart: (id: string) => void;
  isInCart: (id: string) => boolean;
  getItemFromCart: (id: string) => any;
  cartItems: any[];
  totalItems: number;
  totalPrice: number;
  resetCart: () => void;
}

const CartContext = createContext<CartContextType>({
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearItemFromCart: () => {},
  isInCart: () => false,
  getItemFromCart: () => undefined,
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  resetCart: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export default CartContext;

