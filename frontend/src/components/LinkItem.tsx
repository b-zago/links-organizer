import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import type { LinkItemProps } from "../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LinkItem({
  title,
  description,
  url,
  id,
  showEditForm,
  showDelPopup,
}: LinkItemProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const desc = description ? description : "";
    showEditForm(id, title, desc, url);
    console.log("Edit link", title);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showDelPopup(id, "link");
    // TODO: Add delete functionality
    console.log("Delete link", title);
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="item">
      <button className="item-delete-btn" onClick={handleDelete}>
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
      <button className="item-edit-btn" onClick={handleEdit}>
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
      <FontAwesomeIcon icon={faBookmark} />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </a>
  );
}

export default LinkItem;
