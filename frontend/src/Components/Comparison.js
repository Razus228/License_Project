import React from "react";
import CarSearchWithCarQuery from "./CarSearchWithCarQuery";
import "./Comparison.css";

function Comparison() {
  return (
    <div className="comparison-container">
      <div className="comparison-column">
        <h3 style={{textAlign: "center"}}>Car 1</h3>
        <CarSearchWithCarQuery />
      </div>
      <div className="comparison-column">
        <h3 style={{textAlign: "center"}}>Car 2</h3>
        <CarSearchWithCarQuery />
      </div>
    </div>
  );
}

export default Comparison;
