import "./App.css";
import CreatePostForm from "./Components/Create Posts/CreatePostsForm";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Components/RootLayout";
import PostsCtxProvider from "./Store/CreatePostFormCtx";
import PostsAndSuggests from "./Components/post and suggests";
import SavedPosts from "./Components/Saved Posts/savedPosts";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./Components/Theme/ThemeContext";
import ComingSoonPage from "./Components/Coming Soon/ComingSoon";
import AddStoryModal from "./Components/Story/AddStory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <PostsAndSuggests /> },
      { path: "new-post", element: <CreatePostForm /> },
      { path: "edit/:postId", element: <CreatePostForm /> },
      { path: "saved-posts", element: <SavedPosts /> },
      { path: "trends", element: <ComingSoonPage /> },
      { path: "search", element: <ComingSoonPage /> },
      { path: "profile", element: <ComingSoonPage /> },
      { path: "add-story", element: <AddStoryModal /> },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <PostsCtxProvider>
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </PostsCtxProvider>
    </ThemeProvider>
  );
}

export default App;
