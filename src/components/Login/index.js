import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { userLogin } from "./../../reducers/Login";
import "./style.css";

const popupTools = require("popup-tools");
const MySwal = withReactContent(Swal);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const state = useSelector((state) => {
    return {
      token: state.Login.token,
    };
  });

  const login = async () => {
    setMessage("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, {
        identifier: identifier,
        password: password,
      });
      dispatch(
        userLogin({ role: res.data.result.role.role, token: res.data.token })
      );
      navigate("/");
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const googleLogin = () => {
    popupTools.popup(
      `${process.env.REACT_APP_BASE_URL}/auth/google`,
      "Google Login",
      { width: 400, height: 600 },
      function (err, user) {
        if (err) {
          console.log(err);
        } else {
          dispatch(
            userLogin({
              role: user.result.role.role,
              token: user.token,
            })
          );
          navigate("/");
        }
      }
    );
  };

  const forgotPassword = async () => {
    const { value: email } = await MySwal.fire({
      title: "Forgot Password",
      input: "email",
      inputPlaceholder: "Enter your email address",
      showCancelButton: true,
      confirmButtonColor: "#E07A5F",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (email) {
      try {
        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/check_email`, {
          email,
        });
        MySwal.fire({
          icon: "success",
          text: "Check your email to reset the password",
          confirmButtonColor: "#E07A5F",
        });
      } catch (error) {
        MySwal.fire({
          icon: "error",
          text: "Something went wrong!",
          confirmButtonColor: "#E07A5F",
        });
      }
    }
  };

  return (
    <div className="loginWrapper">
      {state.token ? (
        <>
          <div className="centerWrapper">
            <div className="homeTitle">
              <p>You already loggedin, you don't need to login</p>
            </div>
            <div className="homeButtons">
              <button onClick={() => navigate("/home")}>home</button>
            </div>
          </div>
        </>
      ) : (
        <main className="panel">
          <div className="panel__half half--first">
            <h2>Login</h2>
            {message ? <div className="message">{message}</div> : ""}
            <form
              className="input"
              onSubmit={(e) => {
                e.preventDefault();
                login(e);
              }}
            >
              <input
                type="text"
                placeholder="Email/Username"
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="forgotPassword" onClick={forgotPassword}>
                forgot your password?
              </p>
              <input id="submitButton" type="submit" value="Submit" />
            </form>
            <button
              type="button"
              className="login-with-google-btn"
              onClick={googleLogin}
            >
              Or Login with Google
            </button>
          </div>
          <div className="panel__half half--second">
            <h2>Hello, friend!</h2>
            <p>Enter your personal details and start your journey with us</p>
            <button id="signupButton" onClick={() => navigate("/signup")}>
              Sign up
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default Login;
