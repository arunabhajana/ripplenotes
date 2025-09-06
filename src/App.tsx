import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./app/login/page";
import RegisterPage from "./app/register/page";
import DashboardPage from "./app/dashboard/page";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-muted">
        <Routes>
          {/* Default route goes to login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
