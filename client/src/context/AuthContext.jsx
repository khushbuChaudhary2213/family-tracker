import { createContext, useContext, useEffect, useState } from "react";
import getCurrentUser from "../apiFuncs/getCurrentUser";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   setUser(null);
      //   setIsLoading(false);
      //   return;
      // }
      try {
        const currentUser = await getCurrentUser();
        console.log(currentUser);
        setUser(currentUser);
      } catch (err) {
        console.log(err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
