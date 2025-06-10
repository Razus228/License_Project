import React, { useState } from "react";
import "../index.css";
// import Search from "./Components/SearchComponent/Search";



function CarSearchWithCarQuery() {
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const handleSearch = async () => {
  setLoading(true);
  const { make, year, model, minHorsepower, bodyType } = extractKeywords(query);

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

    if (model) {
      url += `&model=${encodeURIComponent(model)}`;
    }

    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/${url}`
    );
    const textData = await response.text();
    const cleanText = textData
      .replace("var carquery = ", "")
      .replace(/;\s*$/, "");
    const data = JSON.parse(cleanText);

    let results = data.Trims || [];

    if (minHorsepower) {
      results = results.filter((car) => parseInt(car.model_engine_power_ps) > minHorsepower);
    }

    if (bodyType) {
      results = results.filter((car) => String(car.model_body) === bodyType);
    }

    setCars(results);
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
      "BMW", "Mercedes-Benz", "Audi", "Kia", "Hyundai",
      "Dodge", "Acura", "Porsche", "Subaru", "Volkswagen",
      "Mazda", "Lexus"
    ];

    const models = [
      "Corolla", "Camry", "Avalon", "Civic", "Accord", "CR-V", "Mustang", "Explorer", "Optima", "Rio",
      "F-150", "Malibu", "Altima", "370Z", "Maxima", "X5", "X3", "C-Class", "A4", "Soul", "Elantra", "4Runner",
      "Viper", "Cayenne", "A3", "A5", "Forester", "Impreza", "Golf", "Polo", "Touareg", "6", "RX-7",
      "ILX", "MDX", "NSX", "RDX", "A4", "RS 5", "RS 7", "5 Series", "7 Series", "M5", "3 Series",
      "ES 350", "GS 350", "CT 200h"
    ];

    const bodyType = [
      "Coupe", "Sedan", "SUV", "Pickup", "Crossover", "Minivan", "Midsize Cars"
    ];


    const lowerSentence = sentence.toLowerCase();
    let detectedMake = null;
    let detectedYear = null;
    let detectedModel = null;
    let detectedHorsepower = null;
    let detectedBody = null;

    makes.forEach((originalMake) => {
      if (lowerSentence.includes(originalMake.toLowerCase())) {
        detectedMake = originalMake;
      }
    });

    const yearMatch = sentence.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      detectedYear = yearMatch[0];
    }

    models.forEach((originalModel) => {
    if (lowerSentence.includes(originalModel.toLowerCase())) {
      detectedModel = originalModel;
    }

    const hpMatch = sentence.match(/more than (\d+)\s*horsepower/i);
    if (hpMatch) {
      detectedHorsepower =  parseInt(hpMatch[1]);
    }
    });

    bodyType.forEach((originalBody) => {
      if (lowerSentence.includes(originalBody.toLowerCase())) {
        detectedBody = originalBody;
      }
    });

    return { make: detectedMake, year: detectedYear, model: detectedModel, minHorsepower: detectedHorsepower, bodyType: detectedBody };
  };

  return (
    <div className="app-container">
      
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
                  <strong>{key.split("_").slice(1).join(" ").replace(/_/g, " ")}:</strong> {value || "N/A"}
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
