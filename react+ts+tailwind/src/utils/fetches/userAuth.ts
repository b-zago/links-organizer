export function register(username: string, email: string, password: string) {
  return fetch("http://localhost:3000/register", {
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
  return fetch("http://localhost:3000/login", {
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
  return fetch("http://localhost:3000/auth/verify", {
    credentials: "include",
  });
}
