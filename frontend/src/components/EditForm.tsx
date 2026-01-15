import React, { useContext, useState } from "react";
import "./css/AddItemModal.css";
import { DataContext } from "../context/DataContext";
import { UserContext } from "../context/UserContext";
import { editFolder, editLink } from "../utils/fetches/items";
import { updateItemInTree } from "../utils/stateHelpers";

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

  const { setItemsData } = useContext(DataContext);
  const { userData } = useContext(UserContext);

  const onClose = () => {
    openForm(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "folder" && !folderName) return;
    if (mode === "link" && (!url || !title)) return;

    // If user is NOT signed in, handle everything in memory
    if (!userData) {
      if (mode === "folder") {
        setItemsData((prevData) => {
          if (!prevData.folderContents) return prevData;

          const updatedContents = updateItemInTree(
            prevData.folderContents,
            parentFolderID,
            itemID,
            {
              name: folderName,
              description: description || null,
            }
          );

          return { folderContents: updatedContents };
        });
      } else {
        // Editing link in memory
        setItemsData((prevData) => {
          if (!prevData.folderContents) return prevData;

          const updatedContents = updateItemInTree(
            prevData.folderContents,
            parentFolderID,
            itemID,
            {
              title,
              url,
              description: description || null,
            }
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
      editFolder(folderName, description, itemID)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((data) => {
          console.log(data);

          setItemsData((prevData) => {
            if (!prevData.folderContents) return prevData;

            const updatedContents = updateItemInTree(
              prevData.folderContents,
              parentFolderID,
              itemID,
              {
                name: data.name,
                description: data.description,
              }
            );

            return { folderContents: updatedContents };
          });
        })
        .catch((error) => console.error(error.message));
    } else {
      editLink(url, title, description, itemID)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((data) => {
          console.log(data);

          setItemsData((prevData) => {
            if (!prevData.folderContents) return prevData;

            const updatedContents = updateItemInTree(
              prevData.folderContents,
              parentFolderID,
              itemID,
              {
                title: data.title,
                url: data.url,
                description: data.description,
              }
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditItemModal;
