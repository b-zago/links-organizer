import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";
import About from "./routes/About";
import SignIn from "./routes/SignIn";
import { useEffect } from "react";
import { checkAuth } from "./utils/fetches/userAuth";

function App() {
  useEffect(() => {
    checkAuth()
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error("Could not send cookies to server");
        }
        return data;
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  );
}

export default App;
