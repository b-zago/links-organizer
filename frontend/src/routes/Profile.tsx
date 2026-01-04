import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Home() {
  const { userData } = useContext(UserContext);
  return <h1>{userData?.username} PAGE</h1>;
}

export default Home;
