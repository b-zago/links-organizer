import type { BreadcrumbsProps } from "../types/types";

function Breadcrumbs({ list, goToFolder }: BreadcrumbsProps) {
  return (
    <div>
      {list.map((item, index) => {
        return (
          <span key={"bread" + index} onClick={() => goToFolder(item.id)}>
            {item.title} {"->"}
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrumbs;
