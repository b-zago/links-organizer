import { useState } from "react";

function SignInForm() {
  const [signIn, setSignIn] = useState(true);

  return (
    <form>
      <label htmlFor="user">Username:</label>
      <input type="text" name="user" id="user" />
      {!signIn && (
        <>
          <label htmlFor="email">E-mail:</label>
          <input type="email" name="email" id="email" />
        </>
      )}
      <label htmlFor="password">Password:</label>
      <input type="password" name="password" id="password" />
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
