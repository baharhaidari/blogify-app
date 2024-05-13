import React from "react";
import "./Home.css";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <section className="hero__section">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="hero__title"
      >
        Welcome to Blogify
      </motion.h1>

      <div className="hero__content">
        <div className="info__wrapper">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="hero__desc"
          >
            <p>
              Dive into a world of creativity and inspiration with{" "}
              <span className="blogify__span">Blogify</span>. Discover
              captivating stories, explore insightful articles, and engage in
              thought-provoking discussions. Whether you're a seasoned writer
              looking to share your expertise or a curious reader eager for new
              perspectives, Blogify provides the platform to express, engage,
              and evolve.
            </p>
            <p>
              Immerse yourself in a community where ideas flourish and
              connections thrive. Unleash your imagination, unleash your voice,
              and embark on a journey of discovery. With Blogify, every click
              unveils a new adventure, every scroll uncovers a hidden gem. Join
              us in shaping the narrative, shaping the future, one post at a
              time.
            </p>
          </motion.p>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="hero__subtitle"
          >
            <a href="#posts" className="explore__more__link">
              {/* EXPLORE NOW */}
              <span className="explore__more__icon">
                <i class="bx bx-chevrons-down"></i>
              </span>
            </a>
          </motion.h3>
        </div>
      </div>
    </section>
  );
}
