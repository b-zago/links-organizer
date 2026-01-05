import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import type { LinkItemProps } from "../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LinkItem({
  title,
  description,
  url,
  id,
  showEditForm,
}: LinkItemProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Add edit functionality
    const desc = description ? description : "";
    showEditForm(id, title, desc, url);
    console.log("Edit link", title);
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="item">
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
