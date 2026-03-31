import { createContext, useState } from "react";

import type { ReactNode } from "react";
import type { UserContextType, UserData } from "../types/types";

export const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
  logout: () => {},
});

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  const logout = async () => {
    try {
      await fetch("/logout", { method: "POST", credentials: "include" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUserData(null);
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
}
