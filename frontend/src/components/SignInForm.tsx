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

  const validateUsername = (username: string): string | null => {
    if (!username || username.trim().length === 0) {
      return "Username is required";
    }
    if (username.length < 3 || username.length > 20) {
      return "Username must be between 3 and 20 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email || email.trim().length === 0) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password || password.length === 0) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one letter and one number";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous errors

    // Client-side validation
    const usernameError = validateUsername(username);
    if (usernameError) {
      setErrorMessage(usernameError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    if (!signIn) {
      const emailError = validateEmail(email);
      if (emailError) {
        setErrorMessage(emailError);
        return;
      }
    }

    setIsLoading(true); // Start loading

    if (signIn) {
      // Login flow
      login(username.trim(), password)
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
      register(username.trim(), email.trim().toLowerCase(), password)
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
            error.message || "Registration failed. Please try again.",
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
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <button disabled={isLoading}>
        {isLoading ? (
          <span className="btn-loading">
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
