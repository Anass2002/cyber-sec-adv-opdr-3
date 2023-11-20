// src/components/LoginPage.js
import React from "react";
import userManager from "../services/usermanager";

function LoginPage() {
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
