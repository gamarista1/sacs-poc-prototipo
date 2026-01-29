
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitializing = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    const initAuth = async () => {
      // Evitar múltiples llamadas simultáneas a init
      if (isInitializing.current) return;
      isInitializing.current = true;

      try {
        await authService.init();
        const currentUser = await authService.getCurrentUser();
        
        if (isMounted.current) {
          setUser(currentUser);
        }
      } catch (error: any) {
        // Ignorar errores de aborto silenciosos
        if (error.name !== 'AbortError') {
          console.error("Error inicializando autenticación:", error);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
        isInitializing.current = false;
      }
    };

    initAuth();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(email, pass);
      if (isMounted.current) {
        setUser(loggedUser);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      if (isMounted.current) {
        setUser(null);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
