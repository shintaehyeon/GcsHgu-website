import { Routes, Route } from 'react-router-dom';
import GCSPage from "./GCSPage.jsx";
import MajorsPage from "./MajorsPage.jsx";
import PillarsPage from "./PillarsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GCSPage />} />
      <Route path="/majors" element={<MajorsPage />} />
      <Route path="/pillars" element={<PillarsPage />} />
    </Routes>
  );
}
