import React from "react";
import { Link } from "react-router-dom";
import "./ribbon.css";

function Ribbon() {
  return (
    <div className="ribbon">
      <div className="ribbon-left">
        <span className="ribbon-logo"><Link to="/" className="ribbon-logo">🚗 Be Intelligent</Link></span>
      </div>
      <div className="ribbon-right">
        <Link to="/" className="ribbon-link">Search</Link>
        <Link to="/about" className="ribbon-link">About</Link>
        <Link to="/comparison" className="ribbon-link">Comparison</Link>
        <Link to="/login" className="ribbon-link">Login</Link>
      </div>
    </div>
  );
}

export default Ribbon;