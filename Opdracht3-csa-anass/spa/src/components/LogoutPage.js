// LoginPage.js
import React from "react";
import userManager from "../services/usermanager";

function handleLocalLogout() {
  userManager.removeUser().then(() => {
    window.location = "/";
  });
}

function LogoutPage() {
  const handleLogout = () => {
    handleLocalLogout();
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default LogoutPage;
