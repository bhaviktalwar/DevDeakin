import React from "react";

function HeroSection() {
  // Picsum will generate a random image on each refresh
  const randomImage = `https://picsum.photos/1200/300?random=${Math.floor(
    Math.random() * 1000
  )}`;

  return (
    <div style={{ width: "100%", height: "300px", margin: "20px 0" }}>
      <img
        src={randomImage}
        alt="Banner"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

export default HeroSection;
