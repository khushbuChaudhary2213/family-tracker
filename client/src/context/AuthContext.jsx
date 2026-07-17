import { createContext, useContext, useEffect, useState } from "react";
import getCurrentUser from "../apiFuncs/getCurrentUser";
import fetchFamily from "../apiFuncs/fetchFamily";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { placeholder: true } : null;
  });
  const [families, setFamilies] = useState([]);
  const [activeFamily, setActiveFamily] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const switchActiveFamily = (familyId) => {
    const selected = families.find((f) => f.familyId === familyId);
    if (selected) {
      setActiveFamily(selected);
      localStorage.setItem("activeFamilyId", familyId);
    }
  };
  const initializeSession = async (userData) => {
    try {
      const familyRes = await fetchFamily();
      // console.log(familyRes);

      // Safely dig out the family node depending on if your api wrapper strips data layers
      const fetchedFamilies =
        familyRes?.data?.families || familyRes?.data || [];
      console.log("Fetched Families: ", fetchedFamilies);

      const savedActiveId = localStorage.getItem("activeFamilyId");

      const foundActive = fetchedFamilies.find(
        (f) => f.familyId === savedActiveId,
      );

      let currentActive = null;
      if (foundActive) {
        currentActive = foundActive;
      } else if (fetchedFamilies.length > 0) {
        // Default to the first family if no saved selection exists
        currentActive = fetchedFamilies[0];
        localStorage.setItem("activeFamilyId", fetchedFamilies[0].familyId);
      }

      setFamilies(fetchedFamilies);
      setActiveFamily(currentActive);

      const unifiedUserState = {
        ...userData,
        family: currentActive,
      };

      console.log(unifiedUserState);
      setUser(unifiedUserState);
      return unifiedUserState;
    } catch (err) {
      console.error("Session orchestration mapping failure:", err);
      setFamilies([]);
      setActiveFamily(null);
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

  useEffect(() => {
    if (user && user.placeholder === undefined) {
      setUser((prev) => ({
        ...prev,
        family: activeFamily,
      }));
    }
  }, [activeFamily]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeFamilyId");
    setUser(null);
    setFamilies([]);
    setActiveFamily(null);
  };

  // const updateProfileContext = (updatedData) => {
  //   setUser((prev) => ({ ...prev, ...updatedData }));
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        families,
        activeFamily,
        switchActiveFamily,
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
