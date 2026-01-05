import { faFolder } from "@fortawesome/free-regular-svg-icons";
import type { FolderItemProps } from "../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FolderItem({ name, description, id, openFolder }: FolderItemProps) {
  return (
    <div onClick={() => openFolder(id)} className="item">
      <FontAwesomeIcon icon={faFolder} />
      <h3>{name}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}

export default FolderItem;
