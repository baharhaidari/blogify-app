import Posts from "./Blog Posts/Posts";
import Home from "./Home/Home";
import StoryUploader from "./Story/Story";

export default function PostsAndSuggests() {
  return (
    <>
      <div
        style={{ background: "var(--primary-color)", padding: "0 0 0rem 0" }}
      >
        <Home />
        <StoryUploader />
        <Posts />
      </div>
    </>
  );
}
