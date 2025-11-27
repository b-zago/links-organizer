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
import Breadcrumbs from "../components/Breadcrumbs";
import { getBreadcrumbs } from "../utils/breadcrumbs";

function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<HomeFolder>({
    folderContents: null,
  });
  const [currentFolder, setCurrentFolder] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState<
    { id: number; title: string }[]
  >([{ id: 0, title: "Home" }]);
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
    if (currentFolder === 0) {
      setBreadcrumbs([{ id: 0, title: "Home" }]);
      setVisibleItems(itemsData);
      return;
    }

    const newItems = getFolderContentsById(index, currentFolder);
    const newBreadcrumbs = getBreadcrumbs(index, currentFolder);
    setBreadcrumbs(newBreadcrumbs);
    console.log(newItems);
    setVisibleItems({ folderContents: newItems });
  }, [currentFolder]);

  return (
    <>
      {isFormOpen && <AddItemModal openForm={setIsFormOpen} />}
      <Breadcrumbs list={breadcrumbs} goToFolder={setCurrentFolder} />
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
