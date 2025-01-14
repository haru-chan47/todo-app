import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CalculatorEXPBooks from "./pages/CalculatorEXPBooks"
import Navbar from "./pages/Navbar";
import { AuthProvider } from "./contexts/AuthProvider";
import TodoList from "./pages/TodoList";
import AuthPage from "./pages/AuthPage";
//import { AuthContext } from "./contexts/AuthContext";
//import useLocalStorage from "use-local-storage";

export default function App() {
  //const [token, setToken] = useLocalStorage("token", null);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/todolist" element={<TodoList />} />
          <Route path="/calculator" element={<CalculatorEXPBooks />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}