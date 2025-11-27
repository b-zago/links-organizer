import { useContext, useEffect, useState } from "react";
import AddItem from "../components/AddItem";
import "./home.css";
import AddItemModal from "../components/AddForm";
import LinkItem from "../components/LinkItem";
import { DataContext } from "../context/DataContext";
import type { HomeFolder } from "../types/types";
import { homeFolder } from "../utils/testData";
import FolderItem from "../components/FolderItem";
import { getFolderContentsById } from "../utils/extractFolder";

function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<HomeFolder>({
    folderContents: null,
  });
  const [currentFolder, setCurrentFolder] = useState(0);
  const { itemsData, index, setItemsData } = useContext(DataContext);

  useEffect(() => {
    //fetch from backend here - now for dev do on test
    setItemsData(homeFolder);
  }, []);

  useEffect(() => {
    setVisibleItems(itemsData);
  }, [itemsData]);

  useEffect(() => {
    console.log(currentFolder);
    if (currentFolder === 0) return;
    const newItems = getFolderContentsById(index, currentFolder);
    console.log(newItems);
    setVisibleItems({ folderContents: newItems });
  }, [currentFolder]);

  return (
    <>
      {isFormOpen && <AddItemModal openForm={setIsFormOpen} />}
      <div className="items-wrapper">
        {visibleItems.folderContents?.map((item, index) => {
          if (item.type === "link") {
            return (
              <LinkItem
                key={index}
                title={item.title}
                description={item.description}
                url={item.url}
              />
            );
          }
          return (
            <FolderItem
              key={index}
              name={item.name}
              description={item.description}
              id={item.id}
              openFolder={setCurrentFolder}
            />
          );
        })}
        <AddItem openForm={setIsFormOpen} />
      </div>
    </>
  );
}

export default Home;
