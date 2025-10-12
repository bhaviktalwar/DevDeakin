import React from "react";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#2c7a7b",
        color: "black",
        padding: "10px",
        marginTop: "40px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h4 style={{ color: '#000' }}>Explore</h4>
          <p style={{ color: '#000' }}>Home</p>
          <p style={{ color: '#000' }}>Questions</p>
          <p style={{ color: '#000' }}>Articles</p>
          <p style={{ color: '#000' }}>Tutorials</p>
        </div>

        <div>
          <h4 style={{ color: '#000' }}>Support</h4>
          <p style={{ color: '#000' }}>FAQs</p>
          <p style={{ color: '#000' }}>Help</p>
          <p style={{ color: '#000' }}>Contact Us</p>
        </div>

        <div>
          <h4 style={{ color: '#000' }}>Stay connected</h4>

          <span style={{ marginRight: "10px", cursor: "pointer" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="Facebook"
              width="24"
              height="24"
            />
          </span>

          <span style={{ marginRight: "10px", cursor: "pointer" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
              alt="Twitter"
              width="24"
              height="24"
            />
          </span>

          <span style={{ marginRight: "10px", cursor: "pointer" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
              alt="Instagram"
              width="24"
              height="24"
            />
          </span>
        </div>
      </div>

      {/* Bottom section */}
      <div
        style={{ textAlign: "center", marginTop: "20px", paddingTop: "10px" }}
      >
        <h4 style={{ color: '#000' }}>DEV@Deakin 2022</h4>

        <div>
          <span style={{ margin: "0 15px", cursor: "pointer", color: '#000' }}>
            Privacy Policy
          </span>
          <span style={{ margin: "0 15px", cursor: "pointer", color: '#000' }}>Terms</span>
          <span style={{ margin: "0 15px", cursor: "pointer", color: '#000' }}>
            Code of Conduct
          </span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;