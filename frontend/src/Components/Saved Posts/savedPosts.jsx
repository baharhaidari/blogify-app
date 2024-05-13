import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./SavedPosts.css";

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showTextArea, setShowTextArea] = useState({});
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/saved-posts")
      .then((response) => {
        setSavedPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching saved posts:", error);
      });
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:8000/posts/${postId}/like`);
      setSavedPosts((prevPosts) =>
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
    setExpandedPostId((prevId) => (prevId === postId ? null : postId));
    setOpenDropdownId(null);
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

  const handleSavePost = (postId) => {
    // Send a POST request to the backend API to save or unsave the post
    axios
      .post(`http://localhost:8000/posts/${postId}/save`)
      .then((response) => {
        // Handle successful save or unsave
        const updatedSavedPosts = savedPosts.filter(
          (post) => post.id !== postId
        );
        setSavedPosts(updatedSavedPosts);
      })
      .catch((error) => {
        // Handle error
        toast.error("Unable to update saved posts!");
      });
  };

  const handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:8000/delete/${postId}`)
      .then(() => {
        setSavedPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );
        toast.success("Post deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post.");
      });
  };

  const handleAddComment = async (postId) => {
    try {
      await axios.post(`http://localhost:8000/posts/${postId}/comments`, {
        comment: inputValue,
      });
      toast.success("Comment added successfully!");
      setInputValue("");

      // Update the saved posts state to reflect the new comment
      setSavedPosts((prevSavedPosts) =>
        prevSavedPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, inputValue] }
            : post
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again later.");
    }
  };

  return (
    <>
      <section className="posts saved__posts" id="posts">
        <h1 className="posts__section__title">SAVED POSTS</h1>
        <div className="posts__wrapper">
          {savedPosts.map((post) => (
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
                  <i
                    className="fa-solid fa-bookmark"
                    onClick={() => handleSavePost(post.id)}
                  ></i>
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
                        // rows="1"
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
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
