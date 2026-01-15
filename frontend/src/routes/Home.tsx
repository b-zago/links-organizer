import { useContext, useEffect, useState } from "react";
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
  const [visibleItems, setVisibleItems] = useState<HomeFolder>({
    folderContents: null,
  });
  const [currentFolder, setCurrentFolder] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState<
    { id: number; title: string }[]
  >([{ id: 0, title: "Home" }]);
  const [isLoading, setIsLoading] = useState(false);
  const { itemsData, index, setItemsData } = useContext(DataContext);
  const { userData } = useContext(UserContext);

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
  }, [userData, setItemsData]);

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

  const showEditFormLink = (
    id: number,
    title: string,
    description: string,
    url: string
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
    description: string
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Spinner size={40} color="currentColor" borderWidth={3} />
          <p>Loading your folders...</p>
        </div>
      ) : (
        <div className="items-wrapper">
          {visibleItems.folderContents?.map((item, index) => {
            if (item.type === "link") {
              return (
                <LinkItem
                  key={`link${item.id}`}
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
                key={`folder${item.id}`}
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
