import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./app/login/page";
import RegisterPage from "./app/register/page";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-muted">
        <Routes>
          {/* Default route goes to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
