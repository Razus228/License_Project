import "./index.css";
import CarSearchWithCarQuery from "./Components/CarSearchWithCarQuery";
import Ribbon from "./Components/Ribbon";
import About from "./Components/About";
import Login from "./Components/Login";
import Comparison from "./Components/Comparison";
import { BrowserRouter, Route, Routes } from "react-router-dom";


export default function App () {
  return (
    <>
      <BrowserRouter>

        <Ribbon />

        <Routes>

          <Route path="/" element = {<CarSearchWithCarQuery />} />
          <Route path="about" element = { <About />} />
          <Route path="comparison" element = { <Comparison />} />
          <Route path="login" element = { <Login />} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}
  
