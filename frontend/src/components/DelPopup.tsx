import { useContext } from "react";
import "./css/DelPopup.css";
import { DataContext } from "../context/DataContext";
import { UserContext } from "../context/UserContext";
import { delFolder, delLink } from "../utils/fetches/items";
import { deleteItemFromTree } from "../utils/stateHelpers";

type DelPopupProps = {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  itemID: number;
  mode: string;
  parentFolderID: number;
};

function DelPopup({ onClose, itemID, mode, parentFolderID }: DelPopupProps) {
  const { setItemsData } = useContext(DataContext);
  const { userData } = useContext(UserContext);

  const deleteFromMemory = () => {
    setItemsData((prevData) => {
      if (!prevData.folderContents) {
        console.error("No folder contents found!");
        return prevData;
      }

      const updatedContents = deleteItemFromTree(
        prevData.folderContents,
        parentFolderID,
        itemID
      );

      return { folderContents: updatedContents };
    });
  };

  const handleConfirm = () => {
    // If user is NOT signed in, handle everything in memory
    if (!userData) {
      deleteFromMemory();
      onClose(false);
      return;
    }

    // User IS signed in - make API call first, then update state
    if (mode === "folder") {
      delFolder(itemID)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then(() => {
          deleteFromMemory();
          onClose(false);
        })
        .catch((error) => {
          console.error(error.message);
          // Optionally show error to user
          // For now, still close the popup
          onClose(false);
        });
    } else {
      delLink(itemID)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then(() => {
          deleteFromMemory();
          onClose(false);
        })
        .catch((error) => {
          console.error(error.message);
          // Optionally show error to user
          // For now, still close the popup
          onClose(false);
        });
    }
  };

  return (
    <div className="popup-overlay" onClick={() => onClose(false)}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>Are you sure you want to delete this item?</h2>
        <div className="popup-buttons">
          <button className="popup-btn popup-btn-yes" onClick={handleConfirm}>
            Yes
          </button>
          <button
            className="popup-btn popup-btn-no"
            onClick={() => onClose(false)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default DelPopup;
