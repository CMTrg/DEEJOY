import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Favourite from './pages/Favourite';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favourite" element={<Favourite />} />
      </Routes>
    </BrowserRouter>
  );
}
