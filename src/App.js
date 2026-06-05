import React, { useState } from "react";
import RegistrationForm from "./components/RegistrationForm";
import Dashboard from "./components/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [view, setView] = useState("registration");

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">JMJ School</span>
          <div>
            <button
              className="btn btn-outline-light me-2"
              onClick={() => setView("registration")}
            >
              Registration
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => setView("dashboard")}
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {view === "registration" ? <RegistrationForm /> : <Dashboard />}
    </div>
  );
}

export default App;
