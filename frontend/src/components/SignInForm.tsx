import { useContext, useState } from "react";
import { authVerify, login, register } from "../utils/fetches/userAuth";
import { UserContext } from "../context/UserContext";
import type { AuthMessage } from "../types/types";
import { useNavigate } from "react-router-dom";

function SignInForm() {
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const [signIn, setSignIn] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signIn) {
      //some validation
      login(username, password)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((data: AuthMessage) => {
          console.log(data.message); //show toast message here
          authVerify(setUserData);
          navigate("/");
        })
        .catch((data: AuthMessage) => console.error(data.message)); //show toast message here
    } else {
      //some validation
      register(username, email, password)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((data: AuthMessage) => console.log(data.message)) //show toast message here
        .catch((data: AuthMessage) => console.error(data.message)); //show toast message here
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label htmlFor="user">Username:</label>
      <input
        type="text"
        name="user"
        id="user"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {!signIn && (
        <>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </>
      )}
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Sign {signIn ? "In" : "Up"}</button>
      <span>
        {signIn ? "No account yet?" : "Already have an account?"}
        <br />
        <a onClick={() => setSignIn(!signIn)}>Sign {!signIn ? "In" : "Up"}!</a>
      </span>
    </form>
  );
}

export default SignInForm;
