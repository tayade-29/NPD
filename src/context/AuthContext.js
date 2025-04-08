import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null); // New state for user data

  useEffect(() => {
    // Check sessionStorage on first render
    const storedAuth = sessionStorage.getItem('isAuthenticated') === 'true';
    const storedUserData = JSON.parse(sessionStorage.getItem('userData')); // Retrieve user data
    setIsAuthenticated(storedAuth);
    setUserData(storedUserData); // Set user data
    setIsLoading(false);
  }, []);

  const login = (username, role, userData) => {
    setIsAuthenticated(true);
    setUserData(userData); // Set user data on login
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('userData', JSON.stringify(userData)); // Store user data in sessionStorage
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserData(null); // Clear user data on logout
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userData'); // Remove user data from sessionStorage
  };

  if (isLoading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);