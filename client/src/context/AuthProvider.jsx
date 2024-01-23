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
    } else {
      setAuthState(false);
    }
  }, []);

  const setAuth = useCallback(
    (newToken) => {
      setAuthState(true);
      setToken(newToken);
      localStorage.setItem('auth_token', newToken);
    },
    [setAuthState]
  );

  const contextValue = useMemo(
    () => ({ isAuthenticated, setAuth }),
    [isAuthenticated, setAuth]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
