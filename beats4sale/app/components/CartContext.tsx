'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Beat, LicenseTier, LICENSE_TIERS } from '../lib/beats';

export interface CartItem {
  id: string;
  title: string;
  tier: LicenseTier;
  price: number;
  licenseLabel: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_LICENSE'; payload: { id: string; tier: LicenseTier } }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? action.payload : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'UPDATE_LICENSE':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? {
                ...i,
                tier: action.payload.tier,
                price: LICENSE_TIERS[action.payload.tier].price,
                licenseLabel: LICENSE_TIERS[action.payload.tier].label,
              }
            : i
        ),
      };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  addItem: (beat: Beat, tier: LicenseTier) => void;
  removeItem: (id: string) => void;
  updateLicense: (id: string, tier: LicenseTier) => void;
  openCart: () => void;
  closeCart: () => void;
  total: number;
  inCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('beats4sale_cart');
      if (saved) dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('beats4sale_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = useCallback((beat: Beat, tier: LicenseTier) => {
    const license = LICENSE_TIERS[tier];
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: beat.id,
        title: beat.title,
        tier,
        price: license.price,
        licenseLabel: license.label,
      },
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateLicense = useCallback((id: string, tier: LicenseTier) => {
    dispatch({ type: 'UPDATE_LICENSE', payload: { id, tier } });
  }, []);

  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  const total = state.items.reduce((sum, i) => sum + i.price, 0);
  const inCart = useCallback((id: string) => state.items.some((i) => i.id === id), [state.items]);

  return (
    <CartContext.Provider
      value={{ items: state.items, isOpen: state.isOpen, addItem, removeItem, updateLicense, openCart, closeCart, total, inCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
