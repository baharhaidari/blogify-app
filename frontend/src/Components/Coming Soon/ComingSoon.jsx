import React, { useEffect } from "react";
import "./ComingSoon.css";

export default function ComingSoonPage() {
  useEffect(() => {
    const svgContainer = document.getElementById("particle-svg");

    function createBubble() {
      const svgns = "http://www.w3.org/2000/svg";
      const bubble = document.createElementNS(svgns, "circle");
      const size = Math.random() * 15 + 5;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const duration = Math.random() * 5 + 2;
      const opacity = Math.random() * 0.7 + 0.3;

      bubble.setAttributeNS(null, "cx", x);
      bubble.setAttributeNS(null, "cy", y);
      bubble.setAttributeNS(null, "r", size);
      bubble.setAttributeNS(null, "fill", "#1d1d1d");
      bubble.setAttributeNS(null, "opacity", opacity);

      svgContainer.appendChild(bubble);

      setTimeout(() => {
        svgContainer.removeChild(bubble);
      }, duration * 1000);
    }

    function animateBubbles() {
      setInterval(createBubble, 500);
    }

    animateBubbles();

    return () => {
      clearInterval(animateBubbles);
    };
  }, []);

  return (
    <section className="coming__soon__section">
      <h3 className="coming__soon__subtitle">STAY TUNED</h3>
      <h1 className="coming__soon__title">We Will Launch Soon</h1>
      <svg id="particle-svg"></svg>
    </section>
  );
}
