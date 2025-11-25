import React, { useState } from "react";
import "./css/AddItemModal.css";

type ModalMode = "folder" | "link";

interface AddItemModalProps {
  openForm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FolderData {
  type: "folder";
  name: string;
  description?: string;
}

interface LinkData {
  type: "link";
  url: string;
  title: string;
  description?: string;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ openForm }) => {
  const [mode, setMode] = useState<ModalMode>("folder");
  const [folderName, setFolderName] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onClose = () => {
    openForm(false);
  };

  const handleSubmit = () => {
    if (mode === "folder" && !folderName) return;
    if (mode === "link" && (!url || !title)) return;

    if (mode === "folder") {
      console.log({
        type: "folder",
        name: folderName,
        description: description || undefined,
      });
    } else {
      console.log({
        type: "link",
        url,
        title,
        description: description || undefined,
      });
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
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="mode-selector">
          <button
            className={`mode-button ${mode === "folder" ? "active" : ""}`}
            onClick={() => setMode("folder")}
          >
            Folder
          </button>
          <button
            className={`mode-button ${mode === "link" ? "active" : ""}`}
            onClick={() => setMode("link")}
          >
            Link
          </button>
        </div>

        <div className="modal-form">
          {mode === "folder" ? (
            <>
              <div className="form-group">
                <label className="form-label">Folder Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Enter folder name"
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">URL *</label>
                <input
                  type="url"
                  className="form-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter link title"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              {mode === "folder" ? "Create Folder" : "Add Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
