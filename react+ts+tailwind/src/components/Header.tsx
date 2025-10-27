import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLightbulb,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

function Header() {
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
        <a onClick={() => navigate("/signin")}>
          <FontAwesomeIcon icon={faUser} />
          Sign In
        </a>
      </header>
    </>
  );
}

export default Header;
