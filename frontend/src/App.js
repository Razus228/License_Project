import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";

function Ribbon() {
  return (
    <div className="ribbon">
      <div className="logo">🚗 AutoFinder</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/comparison">Comparison</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link>
      </nav>
    </div>
  );
}

function Home() {
  return <div className="home-container">Intelligent Vehicle Search System</div>;
}

function Comparison() {
  return <div className="search-container">Comparison Page - Coming Soon!</div>;
}

function About() {
  return <div className="search-container">About Page - Describe your project here.</div>;
}

function Login() {
  return <div className="search-container">Login Page - Add your login form.</div>;
}

function Search() {
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [trims, setTrims] = useState({});
  const [selected, setSelected] = useState({});
  const [openDetails, setOpenDetails] = useState({});

  const handleSearch = async () => {
    const { make } = extractKeywords(query);
    if (!make) {
      alert("Include a car brand like Toyota, BMW, etc.");
      return;
    }

    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${make}&sold_in_us=1`
      );
      const text = await response.text();
      const clean = text.replace("var carquery = ", "").replace(/;\s*$/, "");
      const data = JSON.parse(clean);
      setCars(data.Models.slice(0, 12));
    } catch (e) {
      console.error(e);
    }
  };

  const extractKeywords = (sentence) => {
    const makes = ["Toyota", "Honda", "Ford", "BMW", "Nissan", "Chevrolet", "Mercedes", "Audi", "Kia", "Hyundai"];
    const found = makes.find((m) => sentence.toLowerCase().includes(m.toLowerCase()));
    return { make: found || null };
  };

  const fetchTrims = async (model, make) => {
    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=${make}&model=${model}`
      );
      const text = await response.text();
      const clean = text.replace("var carquery = ", "").replace(/;\s*$/, "");
      const data = JSON.parse(clean);
      setTrims((prev) => ({ ...prev, [model]: data.Trims }));
    } catch (e) {
      console.error("Error fetching trims:", e);
    }
  };

  const handleCardClick = (model) => {
    setOpenDetails((prev) => ({ ...prev, [model]: !prev[model] }));
  };

  return (
    <div className="search-container">
      <h2>Describe your desired car</h2>
      <input
        type="text"
        placeholder="e.g., I want a Toyota SUV"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", width: "60%", marginRight: "10px" }}
      />
      <button onClick={handleSearch}>Search</button>

      <div className="card-grid">
        {cars.map((car, idx) => (
          <div key={idx} className="card" onClick={() => handleCardClick(car.model_name)}>
            <div><strong>{car.model_name}</strong></div>

            <select
              className="dropdown"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSelected((prev) => ({ ...prev, [car.model_name]: e.target.value }))}
              onFocus={() => {
                if (!trims[car.model_name]) {
                  fetchTrims(car.model_name, car.make_display);
                }
              }}
            >
              <option value="">Select Trim</option>
              {trims[car.model_name]?.map((trim, idx) => (
                <option key={idx} value={trim.model_trim}>
                  {trim.model_trim}
                </option>
              ))}
            </select>

            {openDetails[car.model_name] && selected[car.model_name] && (
              <div className="details">
                <strong>Search Args:</strong>
                <ul>
                  <li><strong>Make:</strong> {car.make_display}</li>
                  <li><strong>Model:</strong> {car.model_name}</li>
                  <li><strong>Trim:</strong> {selected[car.model_name]}</li>
                  {/* You can add more details from trim object if needed */}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Ribbon />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
