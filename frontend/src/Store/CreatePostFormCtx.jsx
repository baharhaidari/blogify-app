import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CreatePostFormCtx = createContext();

export default function PostsCtxProvider({ children }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/");
      const data = response.data;
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CreatePostFormCtx.Provider
      value={{ posts, handleFormSubmit, handleDeletePost }}
    >
      {children}
    </CreatePostFormCtx.Provider>
  );
}
