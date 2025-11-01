import { createContext, useState } from "react";

import type { ReactNode } from "react";
import type { UserContextType, UserData } from "../types/types";

export const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
});

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}
