import type { BreadcrumbsProps } from "../types/types";
import "./css/Breadcrumbs.css";

function Breadcrumbs({ list, goToFolder }: BreadcrumbsProps) {
  return (
    <div className="breadcrumbs-container">
      {list.map((item, index) => {
        const isLast = index === list.length - 1;
        return (
          <span key={"bread" + index} className="breadcrumb-item-wrapper">
            <span
              className={`breadcrumb-item ${isLast ? "active" : ""}`}
              onClick={() => goToFolder(item.id)}
            >
              {item.title}
            </span>
            {!isLast && <span className="breadcrumb-separator">/</span>}
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrumbs;
