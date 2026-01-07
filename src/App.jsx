import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Pair from "./pages/Pair";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/pair" element={<Pair />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
