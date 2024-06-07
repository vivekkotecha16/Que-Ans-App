import React from "react";
import "./App.css";
import QueAnsList from "./pages/QueAnsList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Results from "./pages/Results";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<QueAnsList />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
