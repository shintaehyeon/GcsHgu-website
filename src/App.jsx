import { Routes, Route } from "react-router-dom";
import GCSPage from "./GCSPage.jsx";
import BoardPage from "./pages/BoardPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GCSPage />} />
      <Route path="/board" element={<BoardPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
