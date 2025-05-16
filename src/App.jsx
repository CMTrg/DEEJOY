import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Favourite from './pages/Favourite';
import Blog from './pages/Blog';
import AuthPage from './pages/AuthPage';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favourite" element={<Favourite />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/auth" element={<AuthPage />} /> 
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
