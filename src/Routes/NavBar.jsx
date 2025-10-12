import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { currentUser, userDetails, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
      alert("Successfully signed out!");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Error signing out. Please try again.");
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <h2 style={{ margin: 0 }}>DEV@Deakin</h2>
      <input
        type="text"
        placeholder="Search..."
        style={{ flex: 1, margin: "0 20px", padding: "5px" }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link to="/editor"><button style={{ marginRight: "10px" }}>Post</button></Link>
        <Link to="/pricing"><button style={{ marginRight: "10px" }}>Plans</button></Link>
        
        {currentUser ? (
          // Show when user is logged in
          <>
            <span style={{ 
              marginRight: "10px", 
              fontWeight: "bold",
              color: "#333"
            }}>
              Welcome, {userDetails?.name || currentUser.displayName || currentUser.email.split('@')[0]}
            </span>
            <button 
              onClick={handleSignOut}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          // Show when user is not logged in
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
