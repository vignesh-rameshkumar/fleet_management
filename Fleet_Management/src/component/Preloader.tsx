import React from "react";

import rocketGif from "../assets/rocket.gif"; // Import the GIF
import logo from "../assets/LogoAgnikul.png";
const Preloader: React.FC = () => {
  return (
    <>
      <div className="preloader">
        <img src={rocketGif} alt="Loading..." className="rocket-gif" />
        <img src={logo} style={{ width: "250px" }} />
      </div>
    </>
  );
};

export default Preloader;
