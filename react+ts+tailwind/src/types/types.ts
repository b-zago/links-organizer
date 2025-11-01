export type UserData = {
  id: number;
  username: string;
  email: string;
};

export type UserContextType = {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export type AuthVerifyResponse =
  | { authenticated: false }
  | { authenticated: true; user: UserData };

export type AuthMessage = {
  message: string;
};
