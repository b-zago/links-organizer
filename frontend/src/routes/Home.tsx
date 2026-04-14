import { useContext, useEffect, useMemo, useState } from "react";
import AddItem from "../components/AddItem";
import "./home.css";
import AddItemModal from "../components/AddForm";
import LinkItem from "../components/LinkItem";
import { DataContext } from "../context/DataContext";
import type { EditFormDataType, HomeFolder } from "../types/types";
import FolderItem from "../components/FolderItem";
import { getFolderContentsById } from "../utils/extractFolder";
import Breadcrumbs from "../components/Breadcrumbs";
import { getBreadcrumbs } from "../utils/breadcrumbs";
import { getItems } from "../utils/fetches/items";
import Spinner from "../components/Spinner";
import { UserContext } from "../context/UserContext";
import EditItemModal from "../components/EditForm";
import DelPopup from "../components/DelPopup";

function Home() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDelPopupOpen, setIsDelPopupOpen] = useState(false);
  const [delData, setDelData] = useState({ itemID: 0, mode: "folder" });
  const [editFormData, setEditFormData] = useState<EditFormDataType>({
    itemID: 0,
    mode: "folder",
    currentDescription: "",
    currentTitle: "",
    currentFolderName: "",
    currentURL: "",
  });
  const [currentFolder, setCurrentFolder] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { itemsData, index, setItemsData } = useContext(DataContext);
  const { userData } = useContext(UserContext);

  // Fetch initial data
  useEffect(() => {
    if (!itemsData.folderContents && userData) {
      setIsLoading(true);
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
        .catch((data) => console.error(data.message))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userData]);

  // Clear data when user logs out
  useEffect(() => {
    if (!userData) {
      setItemsData({ folderContents: null });
    }
  }, [userData, setItemsData]);

  // Compute visible items based on currentFolder
  const visibleItems = useMemo<HomeFolder>(() => {
    if (!itemsData.folderContents) {
      return { folderContents: null };
    }

    if (currentFolder === 0) {
      return itemsData;
    }

    const contents = getFolderContentsById(index, currentFolder);
    return { folderContents: contents };
  }, [itemsData, currentFolder, index]);

  // Compute breadcrumbs based on currentFolder
  const breadcrumbs = useMemo(() => {
    if (currentFolder === 0) {
      return [{ id: 0, title: "Home" }];
    }
    return getBreadcrumbs(index, currentFolder);
  }, [index, currentFolder]);

  const showEditFormLink = (
    id: number,
    title: string,
    description: string,
    url: string,
  ) => {
    setEditFormData({
      mode: "link",
      itemID: id,
      currentTitle: title,
      currentDescription: description,
      currentURL: url,
      currentFolderName: "",
    });
    setIsEditFormOpen(true);
  };

  const showEditFormFolder = (
    id: number,
    folderName: string,
    description: string,
  ) => {
    setEditFormData({
      mode: "folder",
      itemID: id,
      currentTitle: "",
      currentDescription: description,
      currentURL: "",
      currentFolderName: folderName,
    });
    setIsEditFormOpen(true);
  };

  const showDelPopup = (itemID: number, mode: string) => {
    setDelData({ itemID, mode });
    setIsDelPopupOpen(true);
  };

  return (
    <>
      {isAddFormOpen && (
        <AddItemModal
          openForm={setIsAddFormOpen}
          parentFolderID={currentFolder}
        />
      )}
      {isEditFormOpen && (
        <EditItemModal
          openForm={setIsEditFormOpen}
          parentFolderID={currentFolder}
          itemID={editFormData.itemID}
          mode={editFormData.mode}
          currentDescription={editFormData.currentDescription}
          currentFolderName={editFormData.currentFolderName}
          currentTitle={editFormData.currentTitle}
          currentURL={editFormData.currentURL}
        />
      )}
      {isDelPopupOpen && (
        <DelPopup
          onClose={setIsDelPopupOpen}
          itemID={delData.itemID}
          mode={delData.mode}
          parentFolderID={currentFolder}
        />
      )}
      <Breadcrumbs list={breadcrumbs} goToFolder={setCurrentFolder} />

      {isLoading ? (
        <div className="loading-container">
          <Spinner size={40} color="currentColor" borderWidth={3} />
          <p>Loading your folders...</p>
        </div>
      ) : (
        <div className="items-wrapper">
          {visibleItems.folderContents?.map((item) => {
            if (item.type === "link") {
              return (
                <LinkItem
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  url={item.url}
                  id={item.id}
                  showEditForm={showEditFormLink}
                  showDelPopup={showDelPopup}
                />
              );
            }
            return (
              <FolderItem
                key={item.id}
                name={item.name}
                description={item.description}
                id={item.id}
                openFolder={setCurrentFolder}
                showEditForm={showEditFormFolder}
                showDelPopup={showDelPopup}
              />
            );
          })}
          <AddItem openForm={setIsAddFormOpen} />
        </div>
      )}
    </>
  );
}

export default Home;
