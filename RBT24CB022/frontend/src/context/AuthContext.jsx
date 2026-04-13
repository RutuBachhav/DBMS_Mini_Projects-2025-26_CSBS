import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('attendx_token');
    const savedUser = localStorage.getItem('attendx_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (tokenVal, userVal) => {
    localStorage.setItem('attendx_token', tokenVal);
    localStorage.setItem('attendx_user', JSON.stringify(userVal));
    setToken(tokenVal);
    setUser(userVal);
  };

  const logout = () => {
    localStorage.removeItem('attendx_token');
    localStorage.removeItem('attendx_user');
    setToken(null);
    setUser(null);
  };

  const api = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    try {
      const res = await fetch(url, { ...options, headers });
      const data = await res.json();
      if (res.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
      }
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }
      return data;
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server.');
      }
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, api, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
