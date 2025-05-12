import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Favourite from './pages/Favourite';
import Blog from './pages/Blog';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favourite" element={<Favourite />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/auth" element={<AuthPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}
