import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HomeContent from './components/home';
import Navbar from './components/navbar';
import EmailVerification from './components/EmailVerification';
import VerificarCorreo from './components/VerificarCorreo';
import VisualizarSemestres from './components/VisualizarSemestres';
import VisualizacionAsignatura from './components/VisualizacionAsignatura'; 
import OlvideContrasena from './components/OlvideContrasena';
import ReestablecerContrasena from './components/ReestablecerContrasena';

import { AuthProvider } from './context/AuthContext';
import Profile from './components/Profile';

function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/email-verification', '/verificar-correo'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="App">
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeContent />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<HomeContent />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/visualizar-semestres" element={<VisualizarSemestres />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/verificar-correo" element={<VerificarCorreo />} />
        <Route path="/visualizar-asignatura" element={<VisualizacionAsignatura />} /> 
        <Route path="/olvide-contrasena" element={<OlvideContrasena />} /> 
        <Route path="/restablecer-contrasena" element={<ReestablecerContrasena />} /> 
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;