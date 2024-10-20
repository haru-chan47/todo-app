import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import CalculatorEXPBooks from "./pages/CalculatorEXPBooks"
import Navbar from "./pages/Navbar";
import RequireAuth from "./pages/Require.Auth";
import TodoList from "./pages/TodoList";
import { AuthContext } from "./contexts/AuthContext";
import useLocalStorage from "use-local-storage";

export default function App() {
  const [token, setToken] = useLocalStorage("token", null);
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/todolist"
            element={
              <RequireAuth>
                <TodoList />
              </RequireAuth>
            }
          />
          <Route path="/calculator"
            element={
              <RequireAuth>
                <CalculatorEXPBooks />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}