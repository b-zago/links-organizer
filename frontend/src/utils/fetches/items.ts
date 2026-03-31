export function addFolder(
  folderName: string,
  description: string | null,
  parentFolderID: number,
) {
  return fetch("/add/folder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
    body: JSON.stringify({
      folderName,
      description,
      parentFolderID,
    }),
  });
}

export function addLink(
  url: string,
  title: string,
  description: string | null,
  parentFolderID: number,
) {
  return fetch("/add/link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
    body: JSON.stringify({
      url,
      title,
      description,
      parentFolderID,
    }),
  });
}

export function getItems() {
  return fetch("/get/items", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
  });
}

export function editFolder(
  folderName: string,
  description: string | null,
  id: number,
) {
  return fetch("/edit/folder", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
    body: JSON.stringify({
      folderName,
      description,
      id,
    }),
  });
}

export function editLink(
  url: string,
  title: string,
  description: string | null,
  id: number,
) {
  return fetch("/edit/link", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
    body: JSON.stringify({
      url,
      title,
      description,
      id,
    }),
  });
}

export function delFolder(id: number) {
  return fetch(`/delete/folder/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
  });
}

export function delLink(id: number) {
  return fetch(`/delete/link/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
  });
}
