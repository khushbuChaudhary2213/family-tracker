import { createContext, useContext, useEffect, useState } from "react";
import getCurrentUser from "../apiFuncs/getCurrentUser";
import fetchFamily from "../apiFuncs/fetchFamily";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { placeholder: true } : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const initializeSession = async (userData) => {
    try {
      const familyRes = await fetchFamily();
      // console.log(familyRes);
      // Safely dig out the family node depending on if your api wrapper strips data layers
      const familyData = familyRes?.data?.family || familyRes?.data || null;

      const unifiedUserState = {
        ...userData,
        family: familyData,
      };

      console.log(unifiedUserState);
      setUser(unifiedUserState);
      return unifiedUserState;
    } catch (err) {
      console.error("Session orchestration mapping failure:", err);
      setUser({ ...userData, family: null });
    }
  };

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      // console.log("Token:", token);

      try {
        const res = await getCurrentUser();
        const userData = res?.data?.user;
        if (userData) {
          // 💡 Hydrate the base user with their family details right at bootup
          await initializeSession(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log(err);
        // handleLogout();
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

  // const updateProfileContext = (updatedData) => {
  //   setUser((prev) => ({ ...prev, ...updatedData }));
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        setUser,
        logout: handleLogout,
        initializeSession,
      }}
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
