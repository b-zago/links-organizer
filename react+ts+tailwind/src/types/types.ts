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

export type LinkItemProps = {
  title: string;
  description: string | null;
  url: string;
};

export type FolderItemProps = {
  title: string;
  description: string | null;
  openFolder: () => void;
};
