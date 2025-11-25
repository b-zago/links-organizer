import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";
import About from "./routes/About";
import SignIn from "./routes/SignIn";
import { useContext, useEffect } from "react";
import { authVerify } from "./utils/fetches/userAuth";
import { UserContext } from "./context/UserContext";
import Profile from "./routes/Profile";

function App() {
  const { setUserData } = useContext(UserContext);

  useEffect(() => authVerify(setUserData), []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
