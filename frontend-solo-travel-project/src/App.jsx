import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Shell from "./Shell";
import Profile from "./components/profile/Profile";
import Signup from "./components/auth/Signup";
import { useEffect, useState } from "react";

function App() {
  // // State for user token and user name
  // const [sessionToken, setSessionToken] = useState("");

  // // Function for updating token in local storage
  // const updateLocalToken = (newToken) => {
  //   localStorage.setItem("token", newToken);
  //   setSessionToken(newToken);
  // };

  // // Effect that keeps the token when the page re-renders
  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     setSessionToken(localStorage.getItem("token"));
  //   }
  // }, []);

  return (
    <div className="App">
      <Shell />
    </div>
  );
}

export default App;
