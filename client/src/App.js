import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HomeContent from './components/home';
import Navbar from './components/navbar';
import EmailVerification from './components/EmailVerification';
import VisualizarSemestres from './components/VisualizarSemestres';

import { AuthProvider } from './context/AuthContext'; // auth context

function AppContent() { // controla el navbar segun la ruta, cuando está logeado se esconde login y register 
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/email-verification'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="App">
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeContent />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<HomeContent />} />
        <Route path="/visualizar-semestres" element={<VisualizarSemestres />} />
        <Route path="/email-verification" element={<EmailVerification />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter> 
      {/* auth context y browser router para mostrar componentes segun url*/}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
