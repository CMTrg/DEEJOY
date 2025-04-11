import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'; // chỉnh lại đường dẫn nếu khác

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
