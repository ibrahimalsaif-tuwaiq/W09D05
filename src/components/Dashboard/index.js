import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Navbar from "./../Navbar";
import "./style.css";

const MySwal = withReactContent(Swal);

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const state = useSelector((state) => {
    return {
      token: state.Login.token,
    };
  });

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  const getUsers = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    setUsers(res.data);
  };

  const deleteUser = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      iconColor: "#D11A2A",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#D11A2A",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        getUsers();
        MySwal.fire({
          title: "Deleted!",
          text: "The user has been deleted",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#E07A5F",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#E07A5F",
        });
      }
    });
  };

  return (
    <>
      {state.token ? (
        <>
          <Navbar />
          <div className="dashboardWrapper">
            <div className="ItemsCon">
              {users ? (
                <ul className="list">
                  {users.map((user) => (
                    <div key={user._id} className="listItem">
                      <li>{user.email}</li>
                      <div>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </ul>
              ) : (
                <h2>There no users!!</h2>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="centerWrapper">
        <div className="signupLoginTitle">
          <h1>YOU HAVE TO LOGIN FIRST</h1>
        </div>
        <div className="signupLoginButtons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Signup</button>
        </div>
      </div>
      )}
    </>
  );
};

export default Dashboard;
