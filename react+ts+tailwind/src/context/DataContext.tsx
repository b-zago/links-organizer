import { createContext, useEffect, useState } from "react";

import type { ReactNode } from "react";
import type { DataContextType, Folder, HomeFolder, Link } from "../types/types";
import { buildFolderIndex } from "../utils/extractFolder";

export const DataContext = createContext<DataContextType>({
  itemsData: { folderContents: null },
  index: new Map(),
  setItemsData: () => {},
});

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [itemsData, setItemsData] = useState<HomeFolder>({
    folderContents: null,
  });
  const [index, setIndex] = useState<Map<number, Folder | Link>>(new Map());

  useEffect(() => {
    if (itemsData.folderContents === null) return;
    console.log("indexing...");
    const newIndex = buildFolderIndex(itemsData);
    setIndex(newIndex);
  }, [itemsData]);

  return (
    <DataContext.Provider value={{ itemsData, index, setItemsData }}>
      {children}
    </DataContext.Provider>
  );
}
