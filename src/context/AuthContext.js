import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage on first render
    const storedAuth = sessionStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(storedAuth);
    setIsLoading(false);
  }, []);

  const login = (username, role) => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('userRole', role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userRole');
  };

  if (isLoading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
