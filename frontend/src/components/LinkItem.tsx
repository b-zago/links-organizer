import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import type { LinkItemProps } from "../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LinkItem({ title, description, url }: LinkItemProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="item">
      <FontAwesomeIcon icon={faBookmark} />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </a>
  );
}

export default LinkItem;
