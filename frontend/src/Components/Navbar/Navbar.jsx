import { useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import ThemeSwitch from "../Theme/ToggleSwitch";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navbar" id="navbar">
      <div className="links__theme__container">
        <div className="logo">
          <a href="#logo">Blogify</a>
        </div>
        <ul className={`links__container ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink
              to="/"
              className={`${({ isActive }) =>
                isActive ? "active" : undefined} nav__link`}
              end
            >
              <span>
                <i class="fa-solid fa-house"></i>
              </span>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/trends"
              className={`${({ isActive }) =>
                isActive ? "active" : undefined} nav__link`}
            >
              <span>
                <i class="fa-solid fa-fire"></i>
              </span>
              Trends
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/new-post"
              className={`${({ isActive }) =>
                isActive ? "active" : undefined} nav__link`}
            >
              <span>
                <i class="fa-solid fa-plus"></i>
              </span>
              New Post
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/search"
              className={`${({ isActive }) =>
                isActive ? "active" : undefined} nav__link`}
            >
              <span>
                <i class="fa-solid fa-magnifying-glass"></i>
              </span>
              Search
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/saved-posts"
              className={`${({ isActive }) =>
                isActive ? "active" : undefined} nav__link`}
            >
              <span>
                <i class="fa-regular fa-bookmark"></i>
              </span>
              Saved
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/profile"
              className={`${({ isActive }) =>
                isActive ? "active" : undefined} nav__link`}
            >
              <span>
                <i class="fa-solid fa-user"></i>
              </span>
              Profile
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="theme__container">
        {/* <i class="fa-solid fa-sun"></i> */}
        <ThemeSwitch />
      </div>

      <div
        id="nav-icon4"
        className={`menu__toggle ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
