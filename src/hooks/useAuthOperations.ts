import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type LoginCredentials = {
  username: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
    role: string;
    barangayId: number | null;
  };
};

type UseAuthOperationsReturn = {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  user: any;
  token: string | null;
};

export const useAuthOperations = (): UseAuthOperationsReturn => {
  const { login: contextLogin, logout: contextLogout, user, token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMessage = (data && data.message) || "Login failed";
        return { success: false, error: errorMessage };
      }

      const { token: authToken, user: userData } = data as LoginResponse;

      const userPayload = {
        id: Number(userData.id),
        username: userData.username,
        name: userData.name,
        role: userData.role,
        barangayId: userData.barangayId === null ? null : Number(userData.barangayId),
      };

      contextLogin(userPayload, authToken);
      
      return { success: true };
    } catch (err: any) {
      return { 
        success: false, 
        error: "Network error. Please check your connection and try again." 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    contextLogout();
  };

  return {
    login,
    logout,
    isAuthenticated,
    user,
    token,
  };
};
