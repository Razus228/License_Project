import { useState } from "react";

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
  
      const response = await fetch(`https://cors-anywhere.herokuapp.com/https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${encodeURIComponent(make)}`);
      const textData = await response.text();

// 💥 Correctly clean the weird CarQuery API text
      const cleanText = textData
        .replace('var carquery = ', '') // remove JS variable declaration
        .replace(/;\s*$/, '');           // remove semicolon at the end

      const data = JSON.parse(cleanText); // finally parse clean JSON
      const models = data.Models || [];

  
      console.log("Fetched Models:", models);
  
      let filteredCars = models;
      if (body) {
        filteredCars = models.filter(car => car.model_body && car.model_body.toLowerCase().includes(body));
      }
  
      setCars(filteredCars.slice(0, 6)); // only first 6
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Basic "NLP" extraction
  const extractKeywords = (sentence) => {
    const makes = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes", "Audi", "Kia", "Hyundai"];
    const bodyTypes = ["sedan", "coupe", "suv", "truck", "van", "convertible", "wagon", "hatchback"];
    const lowerSentence = sentence.toLowerCase();

    let detectedMake = null;
    let detectedYear = null;
    let detectedBody = null;

    makes.forEach(originalMake => {
      if (lowerSentence.includes(originalMake.toLowerCase())) {
        detectedMake = originalMake;
      }
    });

    const yearMatch = sentence.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      detectedYear = yearMatch[0];
    }

    bodyTypes.forEach(type => {
      if (lowerSentence.includes(type)) {
        detectedBody = type;
      }
    });

    return { make: detectedMake, year: detectedYear, body: detectedBody };
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Car Finder (with CarQuery API + NLP)</h1>

      <input
        type="text"
        placeholder="Describe your car (e.g., 'I want a 2024 Toyota sedan')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Search
      </button>

      {loading && <p className="mt-4">Loading...</p>}

      <ul className="mt-4">
        {cars.length === 0 && !loading && <p>No cars found. Try another search!</p>}
        {cars.map((car, index) => (
          <li key={index} className="mb-2 border-b pb-2">
            {car.make_display} {car.model_name} ({car.model_year}) - {car.model_body}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CarSearchWithCarQuery;
