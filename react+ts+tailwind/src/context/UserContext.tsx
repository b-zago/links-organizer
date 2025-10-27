import { createContext, useState } from "react";

import type { ReactNode } from "react";
import type { UserContextType } from "../types/types";

export const UserContext = createContext<UserContextType>({
  username: null,
  setUsername: null,
});

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}
