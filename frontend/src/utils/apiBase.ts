const apiBase =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export default apiBase;
