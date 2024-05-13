import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";

const app = express();
const port = 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const postsFilePath = path.join(__dirname, "/data/posts.json");
const storiesFilePath = path.join(__dirname, "/data/stories.json");

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

let posts = [];
let stories = [];

const loadPosts = () => {
  try {
    const fileContents = fs.readFileSync(postsFilePath, "utf-8");
    posts = JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading posts:", error);
    posts = [];
  }
};

const savePosts = () => {
  try {
    const fileContents = JSON.stringify(posts, null, 2);
    fs.writeFileSync(postsFilePath, fileContents, "utf-8");
  } catch (error) {
    console.error("Error saving posts:", error);
  }
};

const loadStories = () => {
  try {
    const fileContents = fs.readFileSync(storiesFilePath, "utf-8");
    stories = JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading stories:", error);
    stories = [];
  }
};

const saveStories = () => {
  try {
    const fileContents = JSON.stringify(stories, null, 2);
    fs.writeFileSync(storiesFilePath, fileContents, "utf-8");
  } catch (error) {
    console.error("Error saving stories:", error);
  }
};

loadPosts();
loadStories();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json(posts);
});

app.post("/posts", upload.single("image"), (req, res) => {
  const { title, description } = req.body;
  const newPost = {
    id: Date.now(),
    title,
    description,
    createdAt: new Date().getFullYear(),
    image: req.file.filename,
    comments: [],
    like: false,
  };
  posts.push(newPost);
  savePosts();
  res.json(newPost);
});

app.post("/posts/:postId/like", (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = posts.find((post) => post.id === postId);

  if (post) {
    // Toggle the like status
    post.like = !post.like;
    savePosts();
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.delete("/delete/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const index = posts.findIndex((post) => post.id === postId);

  if (index !== -1) {
    posts.splice(index, 1);
    savePosts();
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

app.get("/posts/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = posts.find((post) => post.id === postId);

  if (post) {
    res.json(post);
  } else {
    res.sendStatus(404);
  }
});

app.put("/posts/:postId", upload.single("image"), (req, res) => {
  const postId = parseInt(req.params.postId);
  const { title, description } = req.body;

  const post = posts.find((post) => post.id === postId);
  if (post) {
    post.title = title;
    post.description = description;
    if (req.file) {
      post.image = req.file.filename;
    }
    savePosts();
    res.json(post);
  } else {
    res.sendStatus(404);
  }
});

app.post("/posts/:postId/comments", (req, res) => {
  const postId = parseInt(req.params.postId);
  const { comment } = req.body;

  const post = posts.find((post) => post.id === postId);
  if (post) {
    if (!post.comments) {
      post.comments = [];
    }
    post.comments.push(comment);
    savePosts();
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Add a new route to handle saving and unsaving posts
app.post("/posts/:postId/save", (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = posts.find((post) => post.id === postId);

  if (post) {
    post.saved = !post.saved;
    savePosts();
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Modify the route to fetch saved posts to filter out unsaved posts
app.get("/saved-posts", (req, res) => {
  const savedPosts = posts.filter((post) => post.saved);
  res.json(savedPosts);
});

app.get("/stories", (req, res) => {
  res.json(stories);
});

app.post("/stories", upload.single("image"), (req, res) => {
  const { title } = req.body;
  const newStory = {
    id: Date.now(),
    title,
    imageUrl: req.file.filename,
    createdAt: new Date(),
  };
  stories.push(newStory);
  saveStories();
  res.json(newStory);
});

app.delete("/stories/:storyId", (req, res) => {
  const storyId = parseInt(req.params.storyId);
  const index = stories.findIndex((story) => story.id === storyId);

  if (index !== -1) {
    stories.splice(index, 1);
    saveStories();
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

setInterval(() => {
  stories = stories.filter(
    (story) =>
      Date.now() - new Date(story.createdAt).getTime() <= 24 * 60 * 60 * 1000
  );
  saveStories();
}, 24 * 60 * 60 * 1000);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
