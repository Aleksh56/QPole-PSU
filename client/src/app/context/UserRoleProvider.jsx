import { createContext, useContext, useMemo, useState } from 'react';

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  const setUserRole = (newRole) => setRole(newRole);

  const contextValue = useMemo(() => ({ role, setUserRole }), [role, setUserRole]);

  return <UserRoleContext.Provider value={{ contextValue }}>{children}</UserRoleContext.Provider>;
};

export const useUserRole = () => useContext(UserRoleContext);
