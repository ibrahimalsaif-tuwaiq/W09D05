import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  MdOutlineComment,
  MdFavorite,
  MdModeEditOutline,
  MdDelete,
} from "react-icons/md";
import Navbar from "./../Navbar";
import { storage } from "./../firebase";
import "./style.css";

const MySwal = withReactContent(Swal);

const Post = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [like, setLike] = useState(false);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useParams();

  const state = useSelector((state) => {
    return {
      token: state.Login.token,
      user: state.Login.user,
    };
  });

  useEffect(() => {
    getPost();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (description.trim().length > 0) {
      updatePost();
      setUrl("");
      setDescription("");
    }
    // eslint-disable-next-line
  }, [description]);

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

  const getPost = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      }
    );
    setPost(res.data);
    if (res.data.likes.find((like) => like.createdBy === state.user._id)) {
      setLike(true);
    }
  };

  const likePost = async (likeType) => {
    await axios.post(
      `${process.env.REACT_APP_BASE_URL}/likePost/${id}`,
      {
        like: likeType,
      },
      {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      }
    );

    if (likeType) setLike(true);
    else setLike(false);

    getPost();
  };

  const addComment = async () => {
    const comment = document.getElementById("shareCommentText").value;
    await axios.post(
      `${process.env.REACT_APP_BASE_URL}/comments`,
      {
        description: comment,
        postID: id,
      },
      {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      }
    );
    document.getElementById("shareCommentText").value = "";
    getPost();
  };

  const updateComment = async (commentId) => {
    const { value: text } = await MySwal.fire({
      title: "update A Comment",
      input: "textarea",
      inputPlaceholder: "Type your new comment here...",
      inputAttributes: {
        "aria-label": "Type your new comment here",
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#E07A5F",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (text) {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/comments/${commentId}`,
        {
          description: text,
          postID: id,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      getPost();
    }
  };

  const deleteComment = async (commentId) => {
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
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/commentDelete/${commentId}`,
          {
            postID: id,
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        getPost();
        MySwal.fire({
          title: "Deleted!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#E07A5F",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire({
          title: "Cancelled",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#E07A5F",
        });
      }
    });
  };

  const deleteCommentAdmin = async (commentId, creatorId) => {
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
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/deleteComment`,
          {
            commentID: commentId,
            postID: id,
            creatorID: creatorId,
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        getPost();
        MySwal.fire({
          title: "Deleted!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#E07A5F",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire({
          title: "Cancelled",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#E07A5F",
        });
      }
    });
  };

  const getUpdatedPostData = async () => {
    const { value: file } = await MySwal.fire({
      title: "Update Post",
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
      title: "Update Post",
      input: "textarea",
      inputPlaceholder: "Type your new description here...",
      inputAttributes: {
        "aria-label": "Type your new description here",
      },
      showCancelButton: true,
      confirmButtonText: "Post",
      confirmButtonColor: "#E07A5F",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (text) setDescription(text);
  };

  const updatePost = async () => {
    await axios.put(
      `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
      {
        description: description,
        image: url,
      },
      {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      }
    );
    getPost();
  };

  const deletePost = async () => {
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
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        navigate("/");
        MySwal.fire({
          title: "Deleted!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#E07A5F",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire({
          title: "Cancelled",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#E07A5F",
        });
      }
    });
  };

  const deletePostAdmin = async (creatorId) => {
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
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/deletePost`,
          {
            postID: id,
            creatorID: creatorId,
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        navigate("/");
        MySwal.fire({
          title: "Deleted!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#E07A5F",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire({
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
          {post && (
            <div className="postWrapper">
              <div className="postCard">
                <div className="postOptions">
                  {post.post.createdBy._id === state.user._id && (
                    <div>
                      <MdModeEditOutline
                        className="editIcon"
                        onClick={() => getUpdatedPostData()}
                      />
                      <MdDelete
                        className="deleteIcon"
                        onClick={() => deletePost()}
                      />
                    </div>
                  )}
                  {state.user.role.role === "admin" &&
                  post.post.createdBy._id !== state.user._id ? (
                    <div>
                      <MdDelete
                        className="deleteIcon"
                        onClick={() => deletePostAdmin(post.post.createdBy._id)}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {post.post.image && (
                  <img
                    src={post.post.image}
                    alt={`${post.post.createdBy.username}`}
                  ></img>
                )}
                <p className="postCaption">{post.post.description}</p>
                <div className="postStatus">
                  {like ? (
                    <MdFavorite
                      className="likeIcon"
                      onClick={() => likePost(false)}
                    />
                  ) : (
                    <MdFavorite
                      className="unLikeIcon"
                      onClick={() => likePost(true)}
                    />
                  )}
                  <span>{post.likes.length}</span>
                  <MdOutlineComment className="commentIcon" />
                  <span>
                    {typeof post.comments === "object"
                      ? post.comments.length
                      : 0}
                  </span>
                </div>
                <h4 className="commentsTitle">Comments</h4>
                <div className="shareCommentContainer">
                  <div className="shareCommentUser">
                    <img
                      src={state.user.avatar}
                      alt={`${state.user.username} avatar`}
                    ></img>
                    <p>{state.user.username}</p>
                  </div>
                  <textarea
                    id="shareCommentText"
                    placeholder="Write a comment.."
                  ></textarea>
                  <button className="shareCommentButton" onClick={addComment}>
                    Share
                  </button>
                </div>
                <ul className="commentsWrapper">
                  {typeof post.comments === "object" &&
                    post.comments.map((comment, index) => {
                      return (
                        <li className="commentBox" key={index}>
                          <div className="commentBoxUser">
                            <div className="userInfo">
                              <img
                                src={comment.createdBy.avatar}
                                alt={`${comment.createdBy.username} avatar`}
                              />
                              <p>{comment.createdBy.username}</p>
                            </div>
                            {comment.createdBy._id === state.user._id && (
                              <div className="userOption">
                                <MdModeEditOutline
                                  className="editIcon"
                                  onClick={() => updateComment(comment._id)}
                                />
                                <MdDelete
                                  className="deleteIcon"
                                  onClick={() => deleteComment(comment._id)}
                                />
                              </div>
                            )}
                            {state.user.role.role === "admin" &&
                            comment.createdBy._id !== state.user._id ? (
                              <div className="adminOption">
                                <MdDelete
                                  className="deleteIcon"
                                  onClick={() =>
                                    deleteCommentAdmin(
                                      comment._id,
                                      comment.createdBy._id
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <h6>{comment.description}</h6>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default Post;
