import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Posts.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Loader from "../Loader/Loader";

export default function Posts() {
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showTextArea, setShowTextArea] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [deletePostId, setDeletePostId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch posts from the backend API
    axios
      .get("http://localhost:8000")
      .then((response) => {
        // Set the posts with initial like status from the server
        setPosts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:8000/posts/${postId}/like`);
      // Update the like status locally
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, like: !post.like } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post. Please try again later.");
    }
  };

  const toggleDescription = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      setOpenDropdownId(null);
    }
  };

  const toggleDropdown = (postId) => {
    setOpenDropdownId(openDropdownId === postId ? null : postId);
    setShowTextArea({});
  };

  const handleCommentToggle = (postId) => {
    setShowTextArea({
      ...showTextArea,
      [postId]: !showTextArea[postId],
    });
    setOpenDropdownId(null);
  };

  const handleSavePost = async (postId) => {
    try {
      // Send a POST request to the backend API to save the post
      await axios.post(`http://localhost:8000/posts/${postId}/save`);
      // Update the saved status locally
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, saved: !post.saved } : post
        )
      );
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post. Please try again later.");
    }
  };

  const handleAddComment = async (postId) => {
    try {
      // Add the comment to the server
      await axios.post(`http://localhost:8000/posts/${postId}/comments`, {
        comment: inputValue,
      });
      toast.success("Comment added successfully!");

      // Refresh posts after adding comment
      axios
        .get("http://localhost:8000")
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.error(error);
        });

      // Reset input value
      setInputValue("");

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again later.");
    }
  };

  const handleDeletePost = (postId) => {
    // Set the postId to be deleted and open the delete dialog
    setDeletePostId(postId);
    setOpenDeleteDialog(true);
  };

  const confirmDeletePost = async () => {
    try {
      // Send a delete request to the backend API
      await axios.delete(`http://localhost:8000/delete/${deletePostId}`);
      // Remove the deleted post from the state
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== deletePostId)
      );
      toast.error("Post deleted successfully!", { autoClose: 2000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post. Please try again later.");
    } finally {
      // Close the delete dialog
      setOpenDeleteDialog(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <section className="posts" id="posts">
        <h1 className="posts__section__title">LATEST POSTS</h1>
        <div className="posts__wrapper">
          {posts.map((post) => (
            <div className="post__container" key={post.id}>
              <div className="img__container">
                <img
                  src={`http://localhost:8000/uploads/${post.image}`}
                  alt="post"
                />
              </div>

              <div className="icons__wrapper">
                <div className="like__save__comment">
                  {post.like ? (
                    <i
                      className="fa-solid fa-heart like__filled"
                      onClick={() => handleLike(post.id)}
                    ></i>
                  ) : (
                    <i
                      className={`fa-regular fa-heart ${
                        post.like ? "liked" : ""
                      }`}
                      onClick={() => handleLike(post.id)}
                    ></i>
                  )}

                  <i
                    className="fa-regular fa-comment"
                    onClick={() => handleCommentToggle(post.id)}
                  ></i>

                  {/* Render the bookmark icon based on saved status */}
                  {post.saved ? (
                    <i
                      className="fa-solid fa-bookmark"
                      onClick={() => handleSavePost(post.id)}
                    ></i>
                  ) : (
                    <i
                      className="fa-regular fa-bookmark"
                      onClick={() => handleSavePost(post.id)}
                    ></i>
                  )}
                </div>
                <div className="edit__delete__menu">
                  <i
                    className="fa-solid fa-ellipsis-vertical"
                    onClick={() => toggleDropdown(post.id)}
                  ></i>

                  {openDropdownId === post.id && (
                    <div className="dropdown">
                      <button onClick={() => handleDeletePost(post.id)}>
                        <i className="fa-solid fa-trash"></i> Delete Post
                      </button>
                      <Link to={`/edit/${post.id}`}>
                        <button>
                          <i className="fa-solid fa-pen"></i> Edit Post
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="post__data">
                {post.like ? <p>1 like</p> : ""}
                <h3 className="post__title">{post.title}</h3>
                <p className="post__desc">
                  {post.description.length > 100 && post.id !== expandedPostId
                    ? `${post.description.slice(0, 100)}... `
                    : post.description}
                  {post.description.length > 100 &&
                    post.id !== expandedPostId && (
                      <span
                        className="more__link"
                        onClick={() => toggleDescription(post.id)}
                      >
                        more
                      </span>
                    )}
                  {post.id === expandedPostId &&
                    post.description.length > 100 && (
                      <span
                        className="less__link"
                        onClick={() => toggleDescription(post.id)}
                      >
                        Less
                      </span>
                    )}
                </p>
                <div className="comments__txtarea__wrapper">
                  {showTextArea[post.id] && (
                    <>
                      <textarea
                        cols="180"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Add your comment here"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="submit__comment__btn"
                      >
                        <i class="fa-solid fa-paper-plane"></i>
                      </button>
                    </>
                  )}
                </div>

                {post.comments && showTextArea[post.id] && (
                  <ul className="comments__container">
                    {post.comments &&
                      showTextArea[post.id] &&
                      post.comments.map((comment, index) => (
                        <li key={index} className="comment">
                          {comment}
                        </li>
                      ))}
                  </ul>
                )}

                <h5 className="post__date">{post.createdAt}</h5>
              </div>

              {/* <hr /> */}
            </div>
          ))}
        </div>
      </section>

      {/* Delete confirmation dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDeletePost} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
