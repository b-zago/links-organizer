import { createContext, useMemo, useState } from "react";

import type { ReactNode } from "react";
import type { DataContextType, HomeFolder } from "../types/types";
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

  // Index is derived from itemsData - no need for separate state
  const index = useMemo(() => {
    if (itemsData.folderContents === null) return new Map();
    console.log("indexing...");
    return buildFolderIndex(itemsData);
  }, [itemsData]);

  return (
    <DataContext.Provider value={{ itemsData, index, setItemsData }}>
      {children}
    </DataContext.Provider>
  );
}
