import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PasswordChecklist from "react-password-checklist";
import axios from "axios";
import "./style.css";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const state = useSelector((state) => {
    return {
      token: state.Login.token,
    };
  });

  const signup = async () => {
    setMessage("");
    const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup`, {
      username: username,
      email: email,
      password: password,
      role: process.env.REACT_APP_USER_ROLE,
    });
    if (res.status === 201) {
      navigate("/verify_from_email");
    } else {
      setMessage(res.data.message);
    }
  };

  return (
    <div className="signupWrapper">
      {state.token ? (
        <h1>
          <div className="centerWrapper">
            <div className="homeSignupTitle">
              <p>You already loggedin, you don't need to signup</p>
            </div>
            <div className="homeSignupButtons">
              <button onClick={() => navigate("/")}>HOME</button>
            </div>
          </div>
        </h1>
      ) : (
        <main className="signupPanel">
          <div className="signupPanel__half signupHalf--first">
            <PasswordChecklist
              rules={[
                "minLength",
                "specialChar",
                "number",
                "capital",
                "lowercase",
              ]}
              minLength={6}
              value={password}
              onChange={(isValid) => {
                if (isValid) {
                  const button = document.querySelector("#signupSubmitButton");
                  button.disabled = false;
                } else {
                  const button = document.querySelector("#signupSubmitButton");
                  button.disabled = true;
                }
              }}
            />
            <button id="loginButton" onClick={() => navigate("/login")}>
              or go to login
            </button>
          </div>
          <div className="signupPanel__half signupHalf--second">
            <h2>Signup</h2>
            {message ? <div className="message">{message}</div> : ""}
            <form
              className="signupInput"
              onSubmit={(e) => {
                e.preventDefault();
                signup(e);
              }}
            >
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                id="signupSubmitButton"
                type="submit"
                value="Submit"
                disabled
              />
            </form>
          </div>
        </main>
      )}
    </div>
  );
};

export default Signup;
