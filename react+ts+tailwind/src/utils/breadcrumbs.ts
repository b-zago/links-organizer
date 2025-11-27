import type { Folder, Link } from "../types/types";

type BreadcrumbItem = {
  id: number;
  title: string;
};

export function getBreadcrumbs(
  index: Map<number, Folder | Link>,
  targetId: number
): BreadcrumbItem[] {
  const path: BreadcrumbItem[] = [];
  let currentId: number | null = targetId;

  // Walk up the tree using parentId
  while (currentId !== null) {
    const item = index.get(currentId);
    if (!item) break;

    const title = item.type === "folder" ? item.name : item.title;
    path.unshift({ id: item.id, title });

    currentId = item.parentId; // Read parentId from the item!
  }

  // Add Home at the beginning
  return [{ id: 0, title: "Home" }, ...path];
}
