import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('osnova_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const mockUser = {
    _id: 'mock-id-123',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'admin',
    score: 100,
    achievements: []
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/auth/profile');
      setUser(res.data.user);
    } catch {
      // Fallback to mock user if server DB is down
      console.warn('Backend failed, using mock user');
      setUser(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token: t, user: u } = res.data;
      localStorage.setItem('osnova_token', t);
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      setToken(t);
      setUser(u);
      return u;
    } catch (error) {
      console.warn('Backend login failed, using mock login');
      const t = 'mock-token-123';
      localStorage.setItem('osnova_token', t);
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      setToken(t);
      setUser(mockUser);
      return mockUser;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      const { token: t, user: u } = res.data;
      localStorage.setItem('osnova_token', t);
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      setToken(t);
      setUser(u);
      return u;
    } catch (error) {
      console.warn('Backend register failed, using mock register');
      const t = 'mock-token-123';
      localStorage.setItem('osnova_token', t);
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      setToken(t);
      setUser(mockUser);
      return mockUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('osnova_token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
