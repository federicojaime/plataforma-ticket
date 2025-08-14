import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, Spinner, Button } from 'flowbite-react';
import { HiCheckCircle, HiXCircle, HiOutlineExclamationCircle } from 'react-icons/hi';
import Logo from "../../assets/img/logo_blanco.png";
import EventoBanner from "../../assets/img/festival.jpg";
import Footer from '../Footer';
import { useEffect, useState } from 'react';

const Bienvenida = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [cargando, setCargando] = useState(true);
    const [verificacionExitosa, setVerificacionExitosa] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState("");

    useEffect(() => {
        const verificarToken = async () => {
            try {
                const response = await fetch(`${apiUrl}/user/register/temp/${token}`);
                if (response.ok) {
                    setVerificacionExitosa(true);
                } else if (response.status === 401) {
                    setErrorMensaje("El token no es válido o ha expirado.");
                    setVerificacionExitosa(false);
                } else {
                    setErrorMensaje("Ocurrió un error inesperado.");
                    setVerificacionExitosa(false);
                }
            } catch (error) {
                console.error('Error al verificar el token:', error);
                setErrorMensaje("Ocurrió un error de red.");
                setVerificacionExitosa(false);
            } finally {
                setCargando(false);
            }
        };
        verificarToken();
    }, [apiUrl, token]);

    const irAInicioSesion = () => {
        navigate('/login');
    };

    return (
        <main className="flex-1">
            <div className="min-h-[calc(100vh-64px)] w-full relative bg-gray-100">
                {/* Fondo */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={EventoBanner}
                        alt="Festival Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/90 via-cyan-800/50 to-amber-700/20 backdrop-blur-sm"></div>
                </div>

                {/* Contenido */}
                <div className="relative z-10 w-full h-full py-8 px-4 md:py-12">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8">
                        {/* Sección Izquierda */}
                        <div className="w-full lg:w-1/2 text-white space-y-6 lg:space-y-8">
                            <div className="text-center lg:text-left">
                                <img
                                    src={Logo}
                                    alt="Logo"
                                    className="h-16 md:h-24 mb-4 md:mb-6 mx-auto lg:mx-0"
                                />
                                <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 leading-tight">
                                    {verificacionExitosa ? "¡Verificación Exitosa!" : "Error en la Verificación"}
                                </h1>
                                <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8">
                                    {verificacionExitosa 
                                        ? "Ahora puedes acceder a tu cuenta." 
                                        : "No se pudo verificar tu cuenta. Por favor, intenta de nuevo."}
                                </p>
                            </div>
                        </div>

                        {/* Sección Derecha */}
                        <div className="w-full lg:w-1/2 max-w-md">
                            <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-none w-full">
                                <div className="space-y-6 p-4 md:p-6">
                                    <div className="flex flex-col items-center space-y-6">
                                        {cargando ? (
                                            <Spinner size="xl" color="warning" />
                                        ) : verificacionExitosa ? (
                                            <HiCheckCircle className="w-20 h-20 text-emerald-500" />
                                        ) : (
                                            <HiXCircle className="w-20 h-20 text-red-500" />
                                        )}
                                        <div className="text-center space-y-2">
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                                {verificacionExitosa ? "¡Bienvenido!" : "Error de Verificación"}
                                            </h2>
                                            <p className="text-gray-600">
                                                {verificacionExitosa 
                                                    ? "Tu cuenta ha sido verificada exitosamente. Ahora puedes iniciar sesión."
                                                    : errorMensaje}
                                            </p>
                                        </div>
                                    </div>

                                    {!verificacionExitosa && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <div className="flex items-center text-red-800">
                                                <HiOutlineExclamationCircle className="w-5 h-5 mr-2" />
                                                <span className="text-sm">
                                                    Por favor, revisa el enlace de verificación o intenta nuevamente.
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <Link to="/login" className="w-full">
                                            <Button
                                                gradientDuoTone="cyanToBlue"
                                                className="w-full"
                                            >
                                                Ir a Iniciar Sesión
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default Bienvenida;
