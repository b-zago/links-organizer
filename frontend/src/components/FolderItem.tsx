import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import type { FolderItemProps } from "../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FolderItem({ name, description, id, openFolder }: FolderItemProps) {
  return (
    <div onClick={() => openFolder(id)} className="item-wrapper item">
      <FontAwesomeIcon icon={faFile} />
      <h3>Folder {name}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}

export default FolderItem;
