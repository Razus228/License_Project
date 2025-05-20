import React, { useState } from "react";
import "./index.css";

function CarSearchWithCarQuery() {
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    const { make, year } = extractKeywords(query);

    if (!make) {
      alert("Please include a car brand (like Toyota, Ford, BMW).");
      setLoading(false);
      return;
    }

    try {
      let url = `https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=${encodeURIComponent(make)}`;
      if (year) {
        url += `&year=${year}`;
      }

      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/${url}`
      );
      const textData = await response.text();
      const cleanText = textData
        .replace("var carquery = ", "")
        .replace(/;\s*$/, "");
      const data = JSON.parse(cleanText);

      setCars(data.Trims || []);
      setSelectedCar(null);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractKeywords = (sentence) => {
    const makes = [
      "Toyota", "Honda", "Ford", "Chevrolet", "Nissan",
      "BMW", "Mercedes", "Audi", "Kia", "Hyundai"
    ];

    const lowerSentence = sentence.toLowerCase();
    let detectedMake = null;
    let detectedYear = null;

    makes.forEach((originalMake) => {
      if (lowerSentence.includes(originalMake.toLowerCase())) {
        detectedMake = originalMake;
      }
    });

    const yearMatch = sentence.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      detectedYear = yearMatch[0];
    }

    return { make: detectedMake, year: detectedYear };
  };

  return (
    <div className="app-container">
      <div className="ribbon"> 
        
        <h3>🚗 Car Search System</h3>
        

      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="e.g., Toyota 1985"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {cars.length > 0 && (
        <div className="card-slider">
          {cars.map((car, index) => (
            <div
              key={index}
              className="car-card"
              onClick={() => setSelectedCar(car)}
            >
              <h3>{car.model_name}</h3>
              <select>
                <option>{car.model_trim || "Standard"}</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {selectedCar && (
        <div className="details-panel">
          <h2>{selectedCar.model_make_display} {selectedCar.model_name}</h2>
          <ul>
            {Object.entries(selectedCar).map(([key, value]) => {
              if (key === "sold_in_us") return null;
              return (
                <li key={key}>
                  <strong>{key}:</strong> {value || "N/A"}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CarSearchWithCarQuery;
