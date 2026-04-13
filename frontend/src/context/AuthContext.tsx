import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';

interface User {
  _id: string;
  email: string;
  username: string;
  role: 'Customer' | 'PT' | 'Admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
    try {
      console.log("👉 1. Bắt đầu gọi API /users/me...");
      const response = await api.get('/users/me');
      
      console.log("👉 2. Dữ liệu BE trả về nguyên bản:", response.data);

      // Sửa lại cách lấy dữ liệu cho linh hoạt (đề phòng BE trả về tên key khác)
      const userData = response.data.result || response.data.user || response.data;
      
      console.log("👉 3. Dữ liệu sẽ lưu vào User State:", userData);
      setUser(userData);

    } catch (error: any) {
      console.error('🚨 LỖI TẠI ĐÂY LÀM VĂNG RA TRANG LOGIN:', error.response?.data || error.message);
      logout(); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    await fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};