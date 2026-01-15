import React, { useContext, useState } from "react";
import "./css/AddItemModal.css";
import { DataContext } from "../context/DataContext";
import { UserContext } from "../context/UserContext";
import { addFolder, addLink } from "../utils/fetches/items";
import type { Folder, Link } from "../types/types";
import { addItemToTree } from "../utils/stateHelpers";

type ModalMode = "folder" | "link";

type AddItemModalProps = {
  openForm: React.Dispatch<React.SetStateAction<boolean>>;
  parentFolderID: number;
};

function AddItemModal({ openForm, parentFolderID }: AddItemModalProps) {
  const [mode, setMode] = useState<ModalMode>("folder");
  const [folderName, setFolderName] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { setItemsData } = useContext(DataContext);
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

        setItemsData((prevData) => {
          if (!prevData.folderContents) {
            return { folderContents: [newFolder] };
          }

          const updatedContents = addItemToTree(
            prevData.folderContents,
            parentFolderID,
            newFolder
          );

          return { folderContents: updatedContents };
        });
      } else {
        // Adding link in memory
        const newLink: Link = {
          id: generateTempId(),
          url: url,
          title: title,
          parentId: parentFolderID === 0 ? null : parentFolderID,
          type: "link",
          description: description || null,
        };

        setItemsData((prevData) => {
          if (!prevData.folderContents) {
            return { folderContents: [newLink] };
          }

          const updatedContents = addItemToTree(
            prevData.folderContents,
            parentFolderID,
            newLink
          );

          return { folderContents: updatedContents };
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
            if (!prevData.folderContents) {
              return { folderContents: [newFolder] };
            }

            // Check if already exists (prevent duplicates)
            const exists = prevData.folderContents.some(
              (item) => item.id === newFolder.id
            );
            if (exists) {
              console.log("Folder already exists, skipping");
              return prevData;
            }

            const updatedContents = addItemToTree(
              prevData.folderContents,
              parentFolderID,
              newFolder
            );

            return { folderContents: updatedContents };
          });
        })
        .catch((error) => console.error(error.message));
    } else {
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
            if (!prevData.folderContents) {
              return { folderContents: [newLink] };
            }

            // Check if already exists (prevent duplicates)
            const exists = prevData.folderContents.some(
              (item) => item.id === newLink.id
            );
            if (exists) {
              console.log("Link already exists, skipping");
              return prevData;
            }

            const updatedContents = addItemToTree(
              prevData.folderContents,
              parentFolderID,
              newLink
            );

            return { folderContents: updatedContents };
          });
        })
        .catch((error) => console.error(error.message));
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
}

export default AddItemModal;
