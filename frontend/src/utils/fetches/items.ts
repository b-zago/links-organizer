import apiBase from "../apiBase";

export function addFolder(
  folderName: string,
  description: string | null,
  parentFolderID: number,
) {
  return fetch(`${apiBase}/add/folder`, {
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
  return fetch(`${apiBase}/add/link`, {
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
  return fetch(`${apiBase}/get/items`, {
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
  return fetch(`${apiBase}/edit/folder`, {
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
  return fetch(`${apiBase}/edit/link`, {
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
  return fetch(`${apiBase}/delete/folder/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
  });
}

export function delLink(id: number) {
  return fetch(`${apiBase}/delete/link/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
  });
}
