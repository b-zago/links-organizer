import React, { useContext, useState } from "react";
import "./css/AddItemModal.css";
import { DataContext } from "../context/DataContext";
import { UserContext } from "../context/UserContext";
import {
  addFolder,
  addLink,
  editFolder,
  editLink,
} from "../utils/fetches/items";
import type { Folder, Link } from "../types/types";

type ModalMode = "folder" | "link";

type EditItemModalProps = {
  openForm: React.Dispatch<React.SetStateAction<boolean>>;
  itemID: number;
  parentFolderID: number;
  mode: ModalMode;
  currentFolderName: string;
  currentURL: string;
  currentTitle: string;
  currentDescription: string;
};

function EditItemModal({
  openForm,
  itemID,
  parentFolderID,
  mode,
  currentFolderName,
  currentURL,
  currentTitle,
  currentDescription,
}: EditItemModalProps) {
  const [folderName, setFolderName] = useState(currentFolderName);
  const [url, setUrl] = useState(currentURL);
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);

  const { index, itemsData, setItemsData } = useContext(DataContext);
  const { userData } = useContext(UserContext);

  const onClose = () => {
    openForm(false);
  };

  // Generate a temporary negative ID for client-side items
  const generateTempId = () => {
    return -Math.floor(Math.random() * 1000000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "folder" && !folderName) return;
    if (mode === "link" && (!url || !title)) return;

    // If user is NOT signed in, handle everything in memory
    if (!userData) {
      if (mode === "folder") {
        const newFolder: Folder = {
          id: generateTempId(),
          name: folderName,
          parentId: parentFolderID === 0 ? null : parentFolderID,
          type: "folder",
          description: description || null,
          folderContents: [],
        };

        //do i really need to use setItemsData here?
        setItemsData((prevData) => {
          let folder = null;
          if (parentFolderID === 0) {
            folder = itemsData;
          } else {
            folder = index.get(parentFolderID);
          }
          if (!folder) {
            console.error("Folder not found!");
            return prevData;
          }
          for (const item of folder.folderContents as Folder[]) {
            if (item.id === itemID) {
              item.description = description;
              item.name = folderName;

              break;
            }
          }
          return { ...prevData };
        });
      } else {
        // Editing link in memory
        //do i really need to use setItemsData here?
        setItemsData((prevData) => {
          let folder = null;
          if (parentFolderID === 0) {
            folder = itemsData;
          } else {
            folder = index.get(parentFolderID);
          }

          console.dir(folder);

          //   if (!parentFolder || parentFolder.type !== "folder") {
          //     console.error("Parent folder not found in index");
          //     return prevData;
          //   }
          if (!folder) {
            console.error("Folder not found!");
            return prevData;
          }

          for (const item of folder.folderContents as Link[]) {
            if (item.id === itemID) {
              item.description = description;
              item.url = url;
              item.title = title;
              break;
            }
          }

          return { ...prevData };
        });
      }

      // Reset and close
      setFolderName("");
      setUrl("");
      setTitle("");
      setDescription("");
      onClose();
      return;
    }

    // User IS signed in - make API calls
    if (mode === "folder") {
      console.log({
        type: "folder",
        name: folderName,
        description: description || null,
      });

      editFolder(folderName, description, parentFolderID)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((data) => {
          console.log(data);
          const newFolder: Folder = {
            id: data.id,
            name: data.name,
            parentId: data.parent_folder_id,
            type: "folder",
            description: data.description,
            folderContents: [],
          };

          setItemsData((prevData) => {
            if (parentFolderID === 0) {
              const exists = prevData.folderContents?.some(
                (item) => item.id === newFolder.id
              );
              if (exists) return prevData;

              return {
                folderContents: [...(prevData.folderContents || []), newFolder],
              };
            }

            const parentFolder = index.get(parentFolderID);

            if (!parentFolder || parentFolder.type !== "folder") {
              console.error("Parent folder not found in index");
              return prevData;
            }

            const exists = parentFolder.folderContents.some(
              (item) => item.id === newFolder.id
            );
            if (exists) {
              console.log("Folder already exists, skipping");
              return prevData;
            }

            parentFolder.folderContents.push(newFolder);
            return { ...prevData };
          });
        })
        .catch((data) => console.error(data.message));
    } else {
      console.log({
        type: "link",
        url,
        title,
        description: description || null,
        parentFolderID: parentFolderID,
      });

      editLink(url, title, description, parentFolderID)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((data) => {
          console.log(data);
          const newLink: Link = {
            id: data.id,
            url: data.url,
            title: data.title,
            parentId: data.folder_id,
            type: "link",
            description: data.description,
          };

          setItemsData((prevData) => {
            const parentFolder = index.get(parentFolderID);

            if (!parentFolder || parentFolder.type !== "folder") {
              console.error("Parent folder not found in index");
              return prevData;
            }

            const exists = parentFolder.folderContents.some(
              (item) => item.id === newLink.id
            );
            if (exists) {
              console.log("Link already exists, skipping");
              return prevData;
            }

            parentFolder.folderContents.push(newLink);
            return { ...prevData };
          });
        })
        .catch((data) => console.error(data.message));
    }

    // Reset
    setFolderName("");
    setUrl("");
    setTitle("");
    setDescription("");
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === "folder" ? "Edit Folder" : "Edit Link"}
          </h2>
          <button className="modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="mode-selector">
          <button
            type="button"
            className={`mode-button ${mode === "folder" ? "active" : ""}`}
            onClick={() => {}}
          >
            Folder
          </button>
          <button
            type="button"
            className={`mode-button ${mode === "link" ? "active" : ""}`}
            onClick={() => {}}
          >
            Link
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {mode === "folder" ? (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="folderName">
                  Folder Name *
                </label>
                <input
                  type="text"
                  id="folderName"
                  className="form-input"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="url">
                  URL *
                </label>
                <input
                  type="url"
                  id="url"
                  className="form-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter link title"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {mode === "folder" ? "Create Folder" : "Add Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditItemModal;
