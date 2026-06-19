"use client";

// auth.tsx — Global Auth Context for Mucamanza Crypto Hub

// This file creates a "shared box" (React Context) that holds
// the currently logged-in user's info (username, role, isPaid).
//
// Any page or component can call `useCryptoAuth()` to:
//   - Read who is logged in:  const { user } = useCryptoAuth()
//   - Update after login:     setUser(res.data.user)
//   - Clear after logout:     setUser(null)
//
// The user object is also saved to localStorage so the page
// remembers who you are after a browser refresh.

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Shape of the logged-in user object returned by /api/auth/login
export interface AuthUser {
  username: string;
  role: string;     // "user" | "admin"
  isPaid: boolean;  // true = can download full books
}

// Shape of what the context exposes to every component
interface AuthContextType {
  user: AuthUser | null;       // null means "not logged in"
  setUser: (u: AuthUser | null) => void;
}

// 1. Create the context (starts empty — provider fills it in)
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

// 2. Provider — wraps the whole app inside layout.tsx
//    It reads localStorage on first load so the user stays
//    logged in after a page refresh.
export function CryptoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);

  // On first render, check if a user was previously saved
  useEffect(() => {
    const saved = localStorage.getItem("crypto_user");
    if (saved) setUserState(JSON.parse(saved));
  }, []);

  // When setUser is called, update state AND save to localStorage
  const setUser = (u: AuthUser | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem("crypto_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("crypto_user"); // Clear on logout
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook — shortcut for reading the context in any component
//    Usage: const { user, setUser } = useCryptoAuth();
export function useCryptoAuth() {
  return useContext(AuthContext);
}
