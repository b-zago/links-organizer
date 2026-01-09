import { useContext } from "react";
import "./css/DelPopup.css";
import { DataContext } from "../context/DataContext";
import { UserContext } from "../context/UserContext";
import { delFolder, delLink } from "../utils/fetches/items";

type DelPopupProps = {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  itemID: number;
  mode: string;
  parentFolderID: number;
};

function DelPopup({ onClose, itemID, mode, parentFolderID }: DelPopupProps) {
  const { index, itemsData, setItemsData } = useContext(DataContext);
  const { userData } = useContext(UserContext);

  const deleteFromMemory = () => {
    setItemsData((prevData) => {
      let folder = null;
      if (parentFolderID === 0) {
        folder = itemsData;
      } else {
        folder = index.get(parentFolderID);
      }
      if (!folder || !folder.folderContents) {
        console.error("Folder not found!");
        return prevData;
      }
      for (let i = 0; i < folder.folderContents.length; i++) {
        if (
          folder.folderContents[i].id === itemID &&
          folder.folderContents[i].type === mode
        ) {
          folder.folderContents.splice(i, 1);
          break;
        }
      }
      return { ...prevData };
    });
  };

  const handleConfirm = () => {
    //also add signed in vs not signed in, backend integration yadayada
    // If user is NOT signed in, handle everything in memory
    if (!userData) {
      deleteFromMemory();
    } else {
      if (mode === "folder") {
        //do loading spiner thingy here
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
          });
      } else {
        //do loading spiner thingy here
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
          });
      }
    }
    onClose(false);
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
