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
import { getItems } from "../utils/fetches/items";

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
    if (!itemsData.folderContents) {
      getItems()
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((data) => {
          console.log(data);
          setItemsData(data);
        })
        .catch((data) => console.error(data.message));
    }
  }, []);

  // Combine both effects into one
  useEffect(() => {
    if (!itemsData.folderContents) return;

    if (currentFolder === 0) {
      setBreadcrumbs([{ id: 0, title: "Home" }]);
      setVisibleItems(itemsData);
    } else {
      const newItems = getFolderContentsById(index, currentFolder);
      const newBreadcrumbs = getBreadcrumbs(index, currentFolder);
      setBreadcrumbs(newBreadcrumbs);
      setVisibleItems({ folderContents: newItems });
    }
  }, [itemsData, currentFolder, index]);

  return (
    <>
      {isFormOpen && (
        <AddItemModal openForm={setIsFormOpen} parentFolderID={currentFolder} />
      )}
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
