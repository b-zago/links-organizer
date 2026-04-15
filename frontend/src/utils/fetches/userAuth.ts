import type { AuthVerifyResponse, UserData } from "../../types/types";
import apiBase from "../apiBase";

export function register(username: string, email: string, password: string) {
  return fetch(`${apiBase}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  });
}

export function login(username: string, password: string) {
  return fetch(`${apiBase}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", //tells browser to accept cookies
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
}

export function checkAuth() {
  return fetch(`${apiBase}/auth/verify`, {
    credentials: "include",
  });
}

export function authVerify(
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>,
) {
  checkAuth()
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error("Could not verify user");
      }
      return data;
    })
    .then((data: AuthVerifyResponse) => {
      console.log(data);

      if (data.user) {
        setUserData({
          username: data.user.username,
          id: data.user.id,
          email: data.user.email,
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
