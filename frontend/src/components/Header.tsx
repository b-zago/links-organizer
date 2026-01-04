import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLightbulb,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

function Header() {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <header>
        <a onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome} />
          Home
        </a>
        <a onClick={() => navigate("/about")}>
          <FontAwesomeIcon icon={faLightbulb} />
          About
        </a>
        <a
          onClick={() =>
            userData ? navigate("/profile") : navigate("/signin")
          }
        >
          <FontAwesomeIcon icon={faUser} />
          {userData ? userData.username : "Sign In"}
        </a>
      </header>
    </>
  );
}

export default Header;
