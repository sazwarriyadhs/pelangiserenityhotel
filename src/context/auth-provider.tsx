"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'staff' | 'guest';

export type User = {
    name: string;
    role: UserRole;
};

type AuthContextType = {
  user: User | null;
  loginAs: (role: UserRole) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
    guest: { name: 'Guest User', role: 'guest' },
    staff: { name: 'Staff Member', role: 'staff' },
    admin: { name: 'Administrator', role: 'admin' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUsers.guest);

  const loginAs = (role: UserRole) => {
    setUser(mockUsers[role] || mockUsers.guest);
  };

  return (
    <AuthContext.Provider value={{ user, loginAs }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
