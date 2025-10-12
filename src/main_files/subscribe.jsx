import React from "react";
function Subscribe() {
  return (
    <div
      style={{
        backgroundColor: "gray",
        padding: "10px",
        width: "100%",
        textAlign: "center",
        margin: "10px",
      }}
    >
      <strong>SIGN UP FOR OUR DAILY INSIDER</strong>
      <input
        type="email"
        placeholder="Enter your email"
        style={{
          padding: "5px",
          margin: "0 10px",
          width: "250px",
          color: "black",
        }}
      />
      <button
        style={{
          padding: "5px 15px",
          cursor: "pointer",
          backgroundColor: "lightgray",
        }}
      >
        Subscribe
      </button>
    </div>
  );
}

export default Subscribe;
