export type UserData = {
  id: number;
  username: string;
  email: string;
};

export type UserContextType = {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export type AuthVerifyResponse = { user: UserData };

export type AuthMessage = {
  message: string;
};

export type LinkItemProps = {
  title: string;
  description: string | null;
  url: string;
};

export type FolderItemProps = {
  name: string;
  description: string | null;
  id: number;
  openFolder: React.Dispatch<React.SetStateAction<number>>;
};

//folders n shit

export type Link = {
  id: number;
  type: "link";
  url: string;
  title: string;
  description: string | null;
};

export type Folder = {
  id: number;
  type: "folder";
  name: string;
  description: string | null;
  folderContents: Array<Folder | Link>;
};

export type HomeFolder = {
  folderContents: Array<Folder | Link> | null;
};

export type DataContextType = {
  itemsData: HomeFolder;
  index: Map<number, Folder | Link>;
  setItemsData: React.Dispatch<React.SetStateAction<HomeFolder>>;
};
