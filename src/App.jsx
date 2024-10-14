import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import CalculatorEXPBooks from "./pages/CalculatorEXPBooks"
import Navbar from "./pages/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<CalculatorEXPBooks />} path="/calculator" />
      </Routes>
    </BrowserRouter>
  );
}