import React, { createContext, useContext, useState } from 'react';

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  const setUserRole = (newRole) => setRole(newRole);

  return (
    <UserRoleContext.Provider value={{ role, setUserRole }}>{children}</UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);
