import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ganeshmap_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await fetchCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error("Failed to load authenticated user:", err);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem('ganeshmap_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, role = 'user') => {
    const data = await registerUser(name, email, password, role);
    localStorage.setItem('ganeshmap_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const loginAsDemoAdmin = async () => {
    return login("admin@ganeshmap.com", "admin123");
  };

  const loginAsDemoDevotee = async () => {
    return login("devotee@ganeshmap.com", "user123");
  };

  const logout = () => {
    localStorage.removeItem('ganeshmap_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        loginAsDemoAdmin,
        loginAsDemoDevotee,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
