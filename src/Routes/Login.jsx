import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login2.css";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = user;
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error.message);
      
      // Handle specific Firebase Auth errors
      let errorMessage = "Error logging in. Please try again.";
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password. Please try again.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address format.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case 'auth/invalid-credential':
          errorMessage = "Invalid email or password.";
          break;
        default:
          errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="LoginPage">
      <div className="login-container">
        <div className="login-form-box">
          <div className="signup-link">
            <Link to="/signup">Sign up</Link>
          </div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Your email"
              autoComplete="off"
              required
            />
            <input
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              placeholder="Your password"
              autoComplete="new-password"
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
