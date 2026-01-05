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
  id: number;
  showEditForm: (
    id: number,
    title: string,
    description: string,
    url: string
  ) => void;
};

export type FolderItemProps = {
  name: string;
  description: string | null;
  id: number;
  openFolder: React.Dispatch<React.SetStateAction<number>>;
  showEditForm: (id: number, folderName: string, description: string) => void;
};

export type EditFormDataType = {
  mode: "folder" | "link";
  currentFolderName: string;
  currentURL: string;
  currentTitle: string;
  currentDescription: string;
  itemID: number;
};

//folders n shit

export type Link = {
  id: number;
  parentId: number | null;
  type: "link";
  url: string;
  title: string;
  description: string | null;
};

export type Folder = {
  id: number;
  parentId: number | null;
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
  index: Map<number, Folder>;
  setItemsData: React.Dispatch<React.SetStateAction<HomeFolder>>;
};

export type BreadcrumbsProps = {
  list: { id: number; title: string }[];
  goToFolder: React.Dispatch<React.SetStateAction<number>>;
};
