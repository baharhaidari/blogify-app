import React, { useContext, useState, useEffect, useRef } from "react";
import "./CreatePostsForm.css";
import axios from "axios";
import { CreatePostFormCtx } from "../../Store/CreatePostFormCtx";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [formMode, setFormMode] = useState("create");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { handleFormSubmit } = useContext(CreatePostFormCtx);
  const { postId } = useParams();

  useEffect(() => {
    if (postId) {
      // Fetch the post data using the post ID
      axios
        .get(`http://localhost:8000/posts/${postId}`)
        .then((response) => {
          const { title, description, image } = response.data;
          setTitle(title);
          setDescription(description);
          setFormMode("edit");
          setImageUrl(image);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [postId]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadedImage(URL.createObjectURL(file));
    setImageUrl(URL.createObjectURL(file));
  };

  const handleButtonClick = () => {
    // Trigger the file input click event
    fileInputRef.current.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (formMode === "edit") {
        await axios.put(`http://localhost:8000/posts/${postId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        handleFormSubmit({
          id: parseInt(postId),
          title,
          description,
          imageUrl: imageUrl,
        });

        toast.info("Post edited successfully!", {
          className: "toast-info-custom",
          autoClose: 2000,
        });
      } else if (formMode === "create") {
        const response = await axios.post(
          "http://localhost:8000/posts",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        handleFormSubmit(response.data);
        toast.success("Post created successfully!", { autoClose: 2000 });
      }

      setSelectedFile(null);
      setTitle("");
      setDescription("");
      navigate("..");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    // Navigate to the home page
    navigate("/");
  };

  return (
    <section className="create__post__form">
      <h1 className="creat__post__title">
        {formMode === "edit" ? "Update Post" : "Create New Post"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="form"
        method="post"
        encType="multipart/form-data"
        action=""
      >
        <div className="input__box">
          <label htmlFor="title">Post Title: </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Title"
            id="title"
            required
          />
        </div>

        <div className="input__box">
          <label htmlFor="desc">Post Description: </label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Description"
            rows={10}
            id="desc"
            required
          ></textarea>
        </div>

        <div className="input__box">
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <div className="text">
            <label
              htmlFor="file"
              className="choose__img__btn"
              accept="image/*"
              onClick={handleButtonClick}
            >
              Upload Image
            </label>
          </div>
        </div>

        {imageUrl && (
          <div className="image__wrapper">
            <img
              src={
                uploadedImage
                  ? uploadedImage
                  : `http://localhost:8000/uploads/${imageUrl}`
              }
              alt="Selected"
              className="selected__image"
            />
          </div>
        )}

        <div className="buttons__wrapper">
          <button type="button" className="submit__btn" onClick={handleCancel}>
            Cancel
          </button>

          <button type="submit" className="submit__btn">
            {formMode === "edit" ? "Update Post" : "Create Post"}
          </button>
        </div>
      </form>
    </section>
  );
}
