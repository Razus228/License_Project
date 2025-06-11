import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <h1>Welcome to the Intelligent Vehicle Search System</h1>
      <p>
        This platform is a breakthrough for the Moldovan market, enabling users to explore car data using smart queries.
        Try it out now and find your perfect car in seconds!
      </p>
      <div className="main-buttons">
        <button onClick={() => navigate("/search")}>🔍 Search</button>
        <button onClick={() => navigate("/about")}>📄 About</button>
        <button onClick={() => navigate("/comparison")}>⚖️ Comparison</button>
        <button onClick={() => navigate("/login")}>🔐 Login</button>
      </div>
    </div>
  );
}

export default MainPage;
