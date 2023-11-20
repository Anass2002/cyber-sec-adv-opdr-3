// app.js
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
  const [api_text, setText] = useState([]);

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
          setText("You don't have access to the api!");
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setText(data);

      } else {
        setText([{ id: 1, name: "User not logged in or token expired." }]);
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
        
        <h1>OPDRACHT 3: GET TO KNOW ADVANCED IAM PRACTICES</h1>
        <h2>ReactJS APP with Auth0, API & OPA</h2>
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
        <p className="api-text">{api_text}</p>
      </Router>
    </div>
  );
}

export default App;
