import React from "react";
import { Route, Routes } from "react-router-dom";
import Posts from "./components/Posts";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Post from "./components/Post";
import VerifyTheAccount from "./components/VerifyTheAccount";
import ResetPassword from "./components/ResetPassword";
import VerifyFromEmail from "./components/VerifyFromEmail";
import "./App.css";
require("dotenv").config();

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Posts />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/posts/:id" element={<Post />} />
        <Route exact path="/verify_account/:id" element={<VerifyTheAccount />} />
        <Route exact path="/reset_password/:id" element={<ResetPassword />} />
        <Route exact path="/verify_from_email" element={<VerifyFromEmail />} />
      </Routes>
    </>
  );
};

export default App;
