import { useState } from "react";
import { login, register } from "../utils/fetches/userAuth";

function SignInForm() {
  const [signIn, setSignIn] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signIn) {
      login(username, password)
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((data) => console.log(data))
        .catch((data) => console.error(data.message));
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
        .then((data) => console.log(data))
        .catch((data) => console.error(data.message));
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
