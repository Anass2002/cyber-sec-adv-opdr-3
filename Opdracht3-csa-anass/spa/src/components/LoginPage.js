// LoginPage.js
import React from "react";
import userManager from "../services/usermanager";

function LoginPage() {
  const generateRandomState = () => {
    // Genereer een willekeurige string
    return Math.random().toString(36).substring(2, 15);
  };
  const handleLogin = () => {
    userManager.signinRedirect();
  };
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;