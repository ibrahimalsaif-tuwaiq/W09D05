import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReactCodeInput from "react-verification-code-input";
import axios from "axios";
import "./style.css";

const MySwal = withReactContent(Swal);

const VerifyTheAccount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [code, setCode] = useState("");

  const verifyAccount = async () => {
    if (code.length > 0) {
      try {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/verify_account`,
          {
            id,
            code,
          }
        );
        navigate("/login");
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!, please try again.",
          confirmButtonColor: "#E07A5F",
        });
      }
    }
  };

  return (
    <>
      <div className="verifyAccountWrapper">
        <div className="verifyAccountBox">
          <h1>Verify Your Account</h1>
          <ReactCodeInput fields={4} onComplete={(val) => setCode(val)} />
          <button onClick={verifyAccount}>Verify</button>
        </div>
      </div>
    </>
  );
};

export default VerifyTheAccount;
