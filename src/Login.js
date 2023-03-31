import { useState } from "react";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        navigate("/home/dashboard");
      })
      .catch((error) => {
        console.error("Error logging in:", error.message);
      });
  };

  return (
    <div className="login-container">
      <div className="login-image-container">
        <img src='https://images.unsplash.com/photo-1626908013351-800ddd734b8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2786&q=80' alt="background" />
      </div>
      <div className="login-form-container">
        <form onSubmit={handleLogin} className="login-form">
          <h1>Login into the future!</h1>
          <div className="input-field">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
