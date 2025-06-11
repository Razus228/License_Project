import React, { useState, useEffect } from "react";
import "../index.css";

function CarSearchWithCarQuery() {
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);

  // Fetch car makes
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://www.carqueryapi.com/api/0.3/?cmd=getMakes"
        );
        const text = await response.text();
        const cleanText = text.replace("var carquery = ", "").replace(/;\s*$/, "");
        const data = JSON.parse(cleanText);
        const makes = data.Makes.map((m) => m.make_display);
        setCarMakes(makes);
      } catch (error) {
        console.error("Failed to fetch car makes", error);
      }
    };

    fetchMakes();
  }, []);

  // Fetch car models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://www.carqueryapi.com/api/0.3/?cmd=getModels"
        );
        const text = await response.text();
        const cleanText = text.replace("var carquery = ", "").replace(/;\s*$/, "");
        const data = JSON.parse(cleanText);
        const models = data.Models.map((m) => m.model_name);
        setCarModels(models);
      } catch (error) {
        console.error("Failed to fetch car models", error);
      }
    };

    fetchModels();
  }, []);

    const extractKeywords = (sentence) => {
        const bodyTypes = ["Coupe", "Sedan", "SUV", "Pickup", "Crossover", "Minivan", "Midsize Cars"];
        const lowerSentence = sentence.toLowerCase();

        const detectedMake = carMakes.find((make) =>
            lowerSentence.includes(make.toLowerCase())
        );

        let detectedModel = null;
        if (detectedMake) {
            const makeIndex = lowerSentence.indexOf(detectedMake.toLowerCase());
            const afterMake = lowerSentence.slice(makeIndex + detectedMake.length).trim().split(" ");
            if (afterMake.length > 0) {
            detectedModel = afterMake[0];
            }
        }

        const yearMatch = sentence.match(/\b(19|20)\d{2}\b/);
        const detectedYear = yearMatch ? yearMatch[0] : null;

        const hpMatch = sentence.match(/more than (\d+)\s*horsepower/i);
        const detectedHorsepower = hpMatch ? parseInt(hpMatch[1]) : null;

        const detectedBody = bodyTypes.find((body) =>
            lowerSentence.includes(body.toLowerCase())
        );

    return {
        make: detectedMake,
        model: detectedModel,
        year: detectedYear,
        minHorsepower: detectedHorsepower,
        bodyType: detectedBody,
  };
};

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
      if (year) url += `&year=${year}`;
      if (model) url += `&model=${encodeURIComponent(model)}`;

      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/${url}`
      );
      const textData = await response.text();
      const cleanText = textData.replace("var carquery = ", "").replace(/;\s*$/, "");
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

  return (
    <div className="app-container">
      <h1 className="text-above">See for yourself!!!</h1>

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
