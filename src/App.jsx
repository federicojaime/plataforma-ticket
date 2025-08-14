import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import MercadoPagoContext from './context/MercadoPagoContext';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Evento from './components/evento/Evento';
import Registrar_compra from './components/evento/Registrar_compra';
import Home from './components/menu/Home';
import Bienvenida from './components/menu/Bienvenida';
import RegistroExitoso from './components/menu/RegistroExistoso';
import FalloPago from './components/menu/FalloPago';
import PendientePago from './components/menu/PendientePago';
import Loading from './components/ui/Loading';
import InscripcionExitosa from './components/menu/IncripcionExito';
import NotFound404 from './components/NotFound404';
import MisInscripciones from './components/evento/MisIncripciones';
import Shows from "./components/menu/Shows";
// MercadoPago Context Provider
const MercadoPagoProvider = ({ children }) => {
  const [mpInitialized, setMpInitialized] = useState(false);

  useEffect(() => {
    const initMP = async () => {
      try {
        const mp = await import('@mercadopago/sdk-react');
        mp.initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
        setMpInitialized(true);
      } catch (error) {
        console.error('Error initializing MercadoPago:', error);
      }
    };
    initMP();
  }, []);

  return (
    <MercadoPagoContext.Provider value={{ mpInitialized }}>
      {children}
    </MercadoPagoContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !user.id)) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return user?.id ? children : null;
};

// Main Routes Component
const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/token/:token" element={<Bienvenida />} />
      <Route path="/registro-exitoso" element={<RegistroExitoso />} />

      {/* Payment Status Routes */}
      <Route
        path="/fallo-pago"
        element={
          <ProtectedRoute>
            <FalloPago />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pendiente-pago"
        element={
          <ProtectedRoute>
            <PendientePago />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inscripcion-exito"
        element={
          <ProtectedRoute>
            <InscripcionExitosa />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route index element={<Evento />} />
        <Route path="registrar_compra" element={<Registrar_compra />} />
        <Route path="mis_entradas" element={<MisInscripciones />} />
        <Route path="shows" element={<Shows />} />

      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router basename='/ticket/'>
        <MercadoPagoProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </MercadoPagoProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;