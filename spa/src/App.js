// import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import LogoutPage from "./components/LogoutPage";
import CallbackPage from "./components/CallbackPage";
import userManager from "./services/usermanager";

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiText, setApiText] = useState([]);

  useEffect(() => {
    userManager.getUser().then((user) => {
      if (user) {
        setUserProfile(user.profile);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const handleCallApi = async () => {
    try {
      const user = await userManager.getUser();
      if (user && user.access_token) {
        const response = await fetch("http://localhost:3001/api", {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });

        if (!response.ok) {
          setApiText("Nope!");
          throw new Error(`HTTP error status ${response.status}`);
        }

        const data = await response.json();
        setApiText(data);
      } else {
        setApiText(["User not logged in or token expired."]);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          {!isLoggedIn ? (
            <Route path="/" element={<LoginPage />} />
          ) : (
            <Route path="/" element={<LogoutPage />} />
          )}
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>

        <h1>React APP - OPDRACHT 3: GET TO KNOW ADVANCED IAM PRACTICES</h1>
        {isLoggedIn && (
          <button className="call-api-button" onClick={handleCallApi}>
            Call API
          </button>
        )}
        <div className="card">
          {userProfile && (
            <div className="user-profile">
              <p>Nickname: {userProfile.nickname}</p>
              <p>E-mail: {userProfile.email}</p>
              <p>Sub: {userProfile.sub}</p>
            </div>
          )}
        </div>
        <p className="api-text">{apiText}</p>
      </Router>
    </div>
  );
}

export default App;
