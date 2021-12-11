import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AiOutlinePlus } from "react-icons/ai";
import Navbar from "./../Navbar";
import { storage } from "./../firebase";
import "./style.css";

const MySwal = withReactContent(Swal);

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const state = useSelector((state) => {
    return {
      token: state.Login.token,
    };
  });

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (description.trim().length > 0) {
      addPost();
      setUrl("");
      setDescription("");
    }
    // eslint-disable-next-line
  }, [description]);

  const getPosts = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    setPosts(res.data);
  };

  const handleUpload = (image) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
          });
      }
    );
  };

  const getPostData = async () => {
    const { value: file } = await MySwal.fire({
      title: "Add New Post",
      input: "file",
      inputLabel: "Chose your image or skip if you don't want an image",
      showCancelButton: true,
      confirmButtonText: "Next",
      confirmButtonColor: "#E07A5F",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your image",
      },
    });

    if (file) handleUpload(file);

    const { value: text } = await MySwal.fire({
      title: "Add New Post",
      input: "textarea",
      inputPlaceholder: "Type your description here...",
      inputAttributes: {
        "aria-label": "Type your description here",
      },
      showCancelButton: true,
      confirmButtonText: "Post",
      confirmButtonColor: "#E07A5F",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (text) setDescription(text);
  };

  const addPost = async () => {
    await axios.post(
      `${process.env.REACT_APP_BASE_URL}/posts`,
      {
        image: url,
        description: description,
      },
      {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      }
    );
    getPosts();
  };

  return (
    <>
      {state.token ? (
        <>
          <Navbar />
          <div className="cards">
            {posts.map((post) => {
              return (
                <div className="card-wrap" key={post.post._id}>
                  <div className="card-header">
                    <img
                      src={post.post.createdBy.avatar}
                      alt={`${post.post.createdBy.username} avatar`}
                      className="avatar"
                    />
                    <div className="card-header-info">
                      {post.post.createdBy.username}
                      <p>{post.post.description}</p>
                    </div>
                  </div>
                  <button
                    className="viewButton"
                    onClick={() => navigate(`/posts/${post.post._id}`)}
                  >
                    VIEW
                  </button>
                </div>
              );
            })}
          </div>
          <button id="fixedbutton" onClick={getPostData}>
            <AiOutlinePlus />
          </button>
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

export default Posts;
