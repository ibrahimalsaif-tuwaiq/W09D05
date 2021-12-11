import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Navbar from "./../Navbar";
import "./style.css";

const Posts = () => {
  const dispatch = useDispatch();

  const state = useSelector((state) => {
    return {
      token: state.Login.token,
      user: state.Login.user,
    };
  });

  return (
    <div>
      {state.token ? (
        <>
          <Navbar />
          <div>
            <div className="tweet-wrap">
              <div className="tweet-header">
                <img src="https://pbs.twimg.com/profile_images/1012717264108318722/9lP-d2yM_400x400.jpg" alt="" className="avator" />
                <div className="tweet-header-info">
                  Steve Schoger
                  <p>
                    🔥 If you're tired of using outline styles for secondary
                    buttons, a soft solid background based on the text color can
                    be a great alternative.
                  </p>
                </div>
              </div>

              <div className="tweet-info-counts"></div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Posts;
