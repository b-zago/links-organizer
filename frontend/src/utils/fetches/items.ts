export function addFolder(
  folderName: string,
  description: string | null,
  parentFolderID: number
) {
  return fetch("http://localhost:3000/add/folder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
    body: JSON.stringify({
      folderName: folderName,
      description: description,
      parentFolderID: parentFolderID,
    }),
  });
}

export function addLink(
  url: string,
  title: string,
  description: string | null,
  parentFolderID: number
) {
  return fetch("http://localhost:3000/add/link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
    body: JSON.stringify({
      url: url,
      title: title,
      description: description,
      parentFolderID: parentFolderID,
    }),
  });
}

export function getItems() {
  return fetch("http://localhost:3000/get/items", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
  });
}
