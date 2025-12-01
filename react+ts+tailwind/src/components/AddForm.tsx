import React, { useContext, useState } from "react";
import "./css/AddItemModal.css";
import { DataContext } from "../context/DataContext";
import { addFolder, addLink } from "../utils/fetches/items";
import type { Folder, Link } from "../types/types";

type ModalMode = "folder" | "link";

type AddItemModalProps = {
  openForm: React.Dispatch<React.SetStateAction<boolean>>;
  parentFolderID: number;
};

const AddItemModal: React.FC<AddItemModalProps> = ({
  openForm,
  parentFolderID,
}) => {
  const [mode, setMode] = useState<ModalMode>("folder");
  const [folderName, setFolderName] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { index, setItemsData } = useContext(DataContext);

  const onClose = () => {
    openForm(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "folder" && !folderName) return;
    if (mode === "link" && (!url || !title)) return;

    if (mode === "folder") {
      console.log({
        type: "folder",
        name: folderName,
        description: description || null,
      });

      addFolder(folderName, description, parentFolderID)
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
              // Check if folder already exists at root level
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

            // Check if folder already exists in parent
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

      addLink(url, title, description, parentFolderID)
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
            // Links can't be at root level (parentFolderID can't be 0)
            const parentFolder = index.get(parentFolderID);

            if (!parentFolder || parentFolder.type !== "folder") {
              console.error("Parent folder not found in index");
              return prevData;
            }

            // Check if link already exists in parent
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
            {mode === "folder" ? "Add Folder" : "Add Link"}
          </h2>
          <button className="modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="mode-selector">
          <button
            type="button"
            className={`mode-button ${mode === "folder" ? "active" : ""}`}
            onClick={() => setMode("folder")}
          >
            Folder
          </button>
          <button
            type="button"
            className={`mode-button ${mode === "link" ? "active" : ""}`}
            onClick={() => setMode("link")}
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
};

export default AddItemModal;
