import React from "react";
import "./Hero.css";
import hand_icon from "../../assets/Assets/hand_icon.png";
import arrow_icon from "../../assets/Assets/arrow.png";
import hero_image from "../../assets/Assets/hero_image.png";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY</h2>
        <div className="hero-hand-icon">
          <p>New</p>
          <img src={hand_icon} alt="Hand Icon" />
        </div>
        <p>collections</p>
        <p>for everyone</p>
        <button className="hero-latest-btn">
          Latest Collection <img src={arrow_icon} alt="Arrow Icon" />
        </button>
      </div>
      <div className="hero-right">
        <div className="hero-image">
          <img src={hero_image} alt="Hero" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
