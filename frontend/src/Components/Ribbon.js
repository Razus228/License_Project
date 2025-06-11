import React from "react";
import { NavLink } from "react-router-dom";
import "./Ribbon.css";

function Ribbon() {
  return (
    <div className="ribbon">
      <span className="ribbon-logo">
        <NavLink to="/" className="no-link-style">🚗 Be Intelligent</NavLink>
      </span>
      <div className="ribbon-options">
        <NavLink to="/search" className={({ isActive }) => isActive ? "active" : ""}>Search</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink>
        <NavLink to="/comparison" className={({ isActive }) => isActive ? "active" : ""}>Comparison</NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink>
      </div>
    </div>
  );
}

export default Ribbon;
