import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const value = { user, setUser }; // always provide an object
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  // return a safe fallback instead of null to avoid destructure errors
  return ctx ?? { user: null, setUser: () => {} };
};