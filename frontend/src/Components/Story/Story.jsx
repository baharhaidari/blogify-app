import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import "./Story.css";

export default function StoryUploader() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    // Fetch stories from backend
    axios
      .get("https://blogify-app-m3p1.onrender.com/stories")
      .then((response) => {
        setStories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stories:", error);
      });
  }, []);

  // Function to handle opening the modal with the selected story
  const openModal = (story) => {
    setSelectedStory(story);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setSelectedStory(null);
  };

  return (
    <section className="story__section">
      <Link to="/add-story" className="add__story__link">
        New Story
        <span className="add__story__icon">
          <i class="fa-solid fa-circle-plus"></i>
        </span>
      </Link>

      <div className="story__list">
        {stories.map((story) => (
          <div
            key={story.id}
            className="story"
            onClick={() => openModal(story)}
          >
            <img
              src={`https://blogify-app-m3p1.onrender.com/uploads/${story.imageUrl}`}
              alt=""
              className="story__image"
            />
            <span>{story.title}</span>
          </div>
        ))}
      </div>

      {/* Modal to display the selected story image */}
      {selectedStory && (
        <Modal closeModal={closeModal}>
          <div className="moda__image__wrapper">
            <img
              src={`https://blogify-app-m3p1.onrender.com/uploads/${selectedStory.imageUrl}`}
              alt=""
              className="modal__image"
            />
          </div>
        </Modal>
      )}
    </section>
  );
}
