import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import type { LinkItemProps } from "../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LinkItem({ title, description, url }: LinkItemProps) {
  const openForm = () => {
    console.log(title);
  };

  return (
    <a href={url} className="item-wrapper item">
      <FontAwesomeIcon icon={faFile} />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </a>
  );
}

export default LinkItem;
