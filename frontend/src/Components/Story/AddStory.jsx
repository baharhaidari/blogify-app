import React, { useState, useRef } from "react";
import axios from "axios";
import "./AddStory.css";
import { useNavigate } from "react-router";
import imgPlaceholder from "../../assets/img__placeholder.webp";

export default function AddStoryForm() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);

      await axios.post("http://localhost:8000/stories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("..");
    } catch (error) {
      console.error("Error uploading story:", error);
    }
  };

  const handleCancel = () => {
    navigate("..");
  };

  const handleSelectImage = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="add__story__section">
      <h2 className="add__story__title">Add Story</h2>

      <form onSubmit={handleSubmit} className="add__story__form">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="select__wrapper">
          <div>
            <button
              type="button"
              onClick={handleSelectImage}
              className="select__image__btn"
            >
              Select Image
            </button>
          </div>

          <img
            src={image ? URL.createObjectURL(image) : imgPlaceholder}
            alt={image ? "Selected Image" : "Placeholder"}
            className={image ? "selected__image" : "placeholder__image"}
          />
        </div>

        <div className="story__buttons">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel__story__btn"
          >
            Cancel
          </button>
          <button type="submit" className="sumbit__story__btn">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
