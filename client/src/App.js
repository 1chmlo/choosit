import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HomeContent from './components/home';
import Navbar from './components/navbar';
import EmailVerification from './components/EmailVerification'; // Importa el nuevo componente

// Componente que decide si mostrar Navbar o no basado en la ruta
function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/email-verification']; // Añade la nueva ruta aquí
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="App">
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeContent />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<HomeContent />} />
        <Route path="/email-verification" element={<EmailVerification />} /> {/* Añade esta nueva ruta */}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;