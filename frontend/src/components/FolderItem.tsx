import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import type { FolderItemProps } from "../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FolderItem({
  name,
  description,
  id,
  openFolder,
  showEditForm,
}: FolderItemProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Add edit functionality
    const desc = description ? description : "";
    showEditForm(id, name, desc);
    console.log("Edit folder", id);
  };

  return (
    <div onClick={() => openFolder(id)} className="item">
      <button className="item-edit-btn" onClick={handleEdit}>
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
      <FontAwesomeIcon icon={faFolder} />
      <h3>{name}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}

export default FolderItem;
