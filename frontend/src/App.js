import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import MainPage from "./Components/MainPage";
import CarSearchWithCarQuery from "./Components/CarSearchWithCarQuery";
import About from "./Components/About";
import Comparison from "./Components/Comparison";
import Login from "./Components/Login";
import Ribbon from "./Components/Ribbon";

function LayoutWithRibbon() {
  const location = useLocation();
  const showRibbon = location.pathname !== "/";

  return (
    <>
      {showRibbon && <Ribbon />}
      <Routes>
        <Route path="/search" element={<CarSearchWithCarQuery />} />
        <Route path="/about" element={<About />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWithRibbon />
    </Router>
  );
}

export default App;
