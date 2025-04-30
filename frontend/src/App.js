import { useState } from "react";
import "./index.css";

function CarSearchWithCarQuery() {
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const { make, year, body } = extractKeywords(query);

    if (!make) {
      alert("Please include a car brand (like Toyota, Ford, BMW).");
      setLoading(false);
      return;
    }

    try {
      let url = `https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${encodeURIComponent(make)}`;
      if (year) {
        url += `&year=${year}`;
      }
      url += `&sold_in_us=1`;

      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/${url}`
      );

      const textData = await response.text();
      const cleanText = textData
        .replace("var carquery = ", "")
        .replace(/;\s*$/, "");

      const data = JSON.parse(cleanText);
      const models = data.Models || [];

      let filteredCars = models;
      if (body) {
        filteredCars = models.filter(
          (car) =>
            car.model_body &&
            car.model_body.toLowerCase().includes(body.toLowerCase())
        );
      }

      setCars(filteredCars.slice(0, 6));
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractKeywords = (sentence) => {
    const makes = [
      "Toyota",
      "Honda",
      "Ford",
      "Chevrolet",
      "Nissan",
      "BMW",
      "Mercedes",
      "Audi",
      "Kia",
      "Hyundai",
    ];
    const bodyTypes = [
      "sedan",
      "coupe",
      "suv",
      "truck",
      "van",
      "convertible",
      "wagon",
      "hatchback",
    ];
    const lowerSentence = sentence.toLowerCase();

    let detectedMake = null;
    let detectedYear = null;
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

    bodyTypes.forEach((type) => {
      if (lowerSentence.includes(type)) {
        detectedBody = type;
      }
    });

    return { make: detectedMake, year: detectedYear, body: detectedBody };
  };

  return (
    <div className="flex-center">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Car Finder</h1>
        <input
          type="text"
          placeholder="Describe your car (e.g., '2024 Toyota SUV')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full mb-4"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
        >
          Search
        </button>
  
        {loading && <p className="mt-4">Loading...</p>}
  
        <ul className="mt-6 text-left">
          {cars.length === 0 && !loading && (
            <p className="text-gray-500">No cars found. Try another search!</p>
          )}
          {cars.map((car, index) => (
            <p key={index} className="mb-3 border-b pb-2">
              {car.make_display} {car.model_name} ({car.model_year}) – {car.model_body}
            </p>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default CarSearchWithCarQuery;
