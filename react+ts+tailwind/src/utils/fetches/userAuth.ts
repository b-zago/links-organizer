export function register(username: string, email: string, password: string) {
  return fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // ← IMPORTANT!
    },

    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  });
}
