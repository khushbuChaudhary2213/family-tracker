import { createContext, useContext, useEffect, useState } from "react";
import getCurrentUser from "../api/getCurrentUser";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
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

  return <AuthContext.Provider value={user, isLoading, setUser}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  return useContext(AuthContext)
}