const apiBase =
  import.meta.env.MODE === "development" ? "http://127.0.0.1:3000" : "";

export default apiBase;
