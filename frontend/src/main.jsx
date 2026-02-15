import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload";
import View from "./pages/View";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Upload />} />
      <Route path="/view/:token" element={<View />} />
    </Routes>
  </BrowserRouter>
);
