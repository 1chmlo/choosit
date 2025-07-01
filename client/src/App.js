import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HomeContent from './components/home';
import Navbar from './components/navbar';
import VerificarCorreo from './components/VerificarCorreo';
import VisualizarSemestres from './components/VisualizarSemestres';
import VisualizacionAsignatura from './components/VisualizacionAsignatura'; 
import OlvideContrasena from './components/OlvideContrasena';
import ReestablecerContrasena from './components/ReestablecerContrasena';
import AdminReports from './components/AdminReports';
import { AuthProvider } from './context/AuthContext';
import Profile from './components/Profile';
import NotFound from './components/NotFound';

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
        <Route path="/verificar-correo" element={<VerificarCorreo />} />
        <Route path="/visualizar-asignatura" element={<VisualizacionAsignatura />} />
        <Route path="/olvide-contrasena" element={<OlvideContrasena />} /> 
        <Route path="/restablecer-contrasena" element={<ReestablecerContrasena />} /> 
         <Route path="/adminreports" element={<AdminReports />} />
        <Route path="*" element={<NotFound />} /> 
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