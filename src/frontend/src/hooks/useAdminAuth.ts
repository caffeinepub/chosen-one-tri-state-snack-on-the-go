import { useState, useEffect } from 'react';

const ADMIN_AUTH_KEY = 'admin_authenticated';
const CORRECT_PIN = '8914';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem(ADMIN_AUTH_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const authenticate = (pin: string): boolean => {
    if (pin === CORRECT_PIN) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    authenticate,
    logout,
  };
}
