import { useContext, useState } from "react";
import { authVerify, login, register } from "../utils/fetches/userAuth";
import { UserContext } from "../context/UserContext";
import type { AuthMessage } from "../types/types";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

function SignInForm() {
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const [signIn, setSignIn] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous errors
    setIsLoading(true); // Start loading

    if (signIn) {
      // Login flow
      login(username, password)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((data: AuthMessage) => {
          console.log(data.message);
          authVerify(setUserData);
          navigate("/");
        })
        .catch((error: Error) => {
          setErrorMessage(error.message || "Login failed. Please try again.");
        })
        .finally(() => {
          setIsLoading(false); // Stop loading
        });
    } else {
      // Register flow
      register(username, email, password)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((data: AuthMessage) => {
          console.log(data.message);
          // After successful registration, automatically log in
          return login(username, password);
        })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((data: AuthMessage) => {
          console.log(data.message);
          authVerify(setUserData);
          navigate("/");
        })
        .catch((error: Error) => {
          setErrorMessage(
            error.message || "Registration failed. Please try again."
          );
        })
        .finally(() => {
          setIsLoading(false); // Stop loading
        });
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

      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px", marginBottom: "10px" }}>
          {errorMessage}
        </div>
      )}

      <button disabled={isLoading}>
        {isLoading ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "inherit",
            }}
          >
            <Spinner size={16} color="white" />
            Loading...
          </span>
        ) : (
          `Sign ${signIn ? "In" : "Up"}`
        )}
      </button>
      <span>
        {signIn ? "No account yet?" : "Already have an account?"}
        <br />
        <a
          onClick={() => {
            setSignIn(!signIn);
            setErrorMessage(""); // Clear error when switching modes
          }}
        >
          Sign {!signIn ? "In" : "Up"}!
        </a>
      </span>
    </form>
  );
}

export default SignInForm;
