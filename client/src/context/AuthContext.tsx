import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { useNavigate } from 'react-router-dom';
import api from '../Config/api';
import toast from 'react-hot-toast';
interface AuthContextType {
   user: User | null;
   token: string | null;
   loading: boolean;
   login: (email: string, password: string) => Promise<void>;
   register: (name: string, email: string, password: string) => Promise<void>;
   logout: () => void;
   updateUser: (userData: Partial<User>) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const navigate = useNavigate();
   const [user, setUser] = useState<User | null>(null);
   const [token, setToken] = useState<string | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   useEffect(() => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      if (storedToken && storedUser) {
         setToken(storedToken);
         setUser(JSON.parse(storedUser));
      }
      setLoading(false);
   }, []);
   const login = async (email: string, password: string) => {
      try {
         const { data } = await api.post('auth/login', { email, password });
         setToken(data.token);
         setUser(data.user);
         localStorage.setItem('auth_token', data.token);
         localStorage.setItem('auth_user', JSON.stringify(data.user));
         toast.success('Login successful!');
         navigate('/');
      } catch (error: any) {
         toast.error(error.response.data.message || error.message);
      }
   };
   const register = async (name: string, email: string, password: string) => {
      try {
         const { data } = await api.post('auth/register', { name, email, password });
         setToken(data.token);
         setUser(data.user);
         localStorage.setItem('auth_token', data.token);
         localStorage.setItem('auth_user', JSON.stringify(data.user));
         toast.success('register successful!');
         navigate('/');
      } catch (error: any) {
         toast.error(error.response.data.message || error.message);
      }
   };
   const logout = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
   };
   const updateUser = (userData: Partial<User>) => {
      if (user) {
         const updatedUser = { ...user, ...userData };
         localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }
   };

   return <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error('useAuth must be used within a AuthProvider');
   }
   return context;
}
