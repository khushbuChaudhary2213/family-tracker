import { createContext, useContext, useEffect, useState } from "react";
import getCurrentUser from "../apiFuncs/getCurrentUser";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await getCurrentUser();
        if (res && res.user) {
          console.log(res);
          setUser(res.user);
        } else {
          handleLogout();
        }
      } catch (err) {
        console.log(err);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, setUser, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}
