import React from "react";
import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <input type="text" placeholder="Login" className="login-input" />
        <input type="password" placeholder="Password" className="login-input" />
        <button className="login-button">Sign In</button>
        <p className="signup-link">
          Don’t have an account? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
