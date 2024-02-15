import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

const AuthContext = createContext({
  isAuthenticated: false,
  setAuth: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthState] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');

    if (storedToken) {
      setAuthState(true);
      setToken(storedToken);
    }
  }, []);

  const setAuth = useCallback(
    (newToken) => {
      if (newToken && typeof newToken === 'string') {
        setAuthState(true);
        setToken(newToken);
        localStorage.setItem('auth_token', newToken);
      } else {
        setAuthState(false);
        setToken('');
        localStorage.removeItem('auth_token');
      }
    },
    [setAuthState, setToken]
  );

  const contextValue = useMemo(
    () => ({ isAuthenticated, setAuth, token }),
    [isAuthenticated, setAuth]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
