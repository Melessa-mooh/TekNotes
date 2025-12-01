import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Bookmarks from "./pages/Bookmarks";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import Uploads from "./pages/Uploads"; // ✅ Import the new page
import Downloads from "./pages/Downloads"; // Import the new page
import Materials from "./pages/Materials"; // ✅ Import Materials
import SearchResources from "./pages/SearchResources"; // Import
import FilePreview from "./pages/FilePreview"; // Import
import ProfileSettings from "./pages/profileSettings";







export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/reviews" element={<Reviews />} />
         <Route path="/uploads" element={<Uploads />} /> {/* ✅ Add the route */}
         <Route path="/search" element={<SearchResources />} />
         <Route path="/materials" element={<Materials />} />
         <Route path="/downloads" element={<Downloads />} />
    
         <Route path="/preview/:id" element={<FilePreview />} />
         <Route path="/settings" element={<Settings />} />
         <Route path="/settings/profile" element={<ProfileSettings />} />
        

      </Routes>
    </Router>
  );
}