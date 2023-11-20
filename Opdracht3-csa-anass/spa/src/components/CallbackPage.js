// Callback
import React, { useEffect } from "react";
import userManager from "../services/usermanager";

function CallbackPage() {
  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then(() => {
        window.location = "/";
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <div>Loading...</div>;
}

export default CallbackPage;
