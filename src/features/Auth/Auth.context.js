import React, { useContext, useState } from "react";

export const AuthContext = React.createContext(null);

function loadFromStorage() {
  const data = localStorage.getItem("auth");

  if (data) {
    return JSON.parse(data);
  }

  return null;
}

export function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState(loadFromStorage);

  function login(data) {
    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);
  }

  function logout() {
    localStorage.removeItem("auth");
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  return value;
}
