// FalloPago.jsx
import { Link } from 'react-router-dom';
import { Card, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Logo from "../../assets/img/logo_blanco.png";
import EventoBanner from "../../assets/img/festival.jpg";
import Footer from '../Footer';

const FalloPago = () => {
    return (
        <main className="flex-1">
            <div className="min-h-[calc(100vh-64px)] w-full relative bg-gray-100">
                {/* Fondo */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={EventoBanner}
                        alt="Festival del Artesano Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-red-800/50 to-red-700/20 backdrop-blur-sm"></div>
                </div>

                {/* Contenido */}
                <div className="relative z-10 w-full h-full py-8 px-4 md:py-12">
                    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-8">
                        <div className="w-full max-w-2xl">
                            <img
                                src={Logo}
                                alt="Logo"
                                className="h-16 md:h-24 mb-8 mx-auto"
                            />
                            
                            <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-none">
                                <div className="space-y-6 p-4 md:p-6">
                                    <div className="flex flex-col items-center space-y-6">
                                        <HiOutlineExclamationCircle className="w-20 h-20 text-red-500" />
                                        <div className="text-center space-y-4">
                                            <h2 className="text-2xl md:text-3xl font-bold text-red-700">
                                                ¡Error en el Pago!
                                            </h2>
                                            <div className="space-y-2">
                                                <p className="text-gray-600">
                                                    Lamentablemente, no pudimos completar tu pago para el Festival del Artesano. Te invitamos a intentarlo nuevamente.
                                                </p>
                                                <p className="text-gray-600">
                                                    Si el problema continúa, contactá nuestro equipo de soporte.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center justify-center text-red-800">
                                            <HiOutlineExclamationCircle className="w-5 h-5 mr-2" />
                                            <span className="text-sm">
                                                Para asistencia, envíanos un <a href="https://www.instagram.com/codeo.ar" target="_blank" rel="noopener noreferrer" className="underline">mensaje</a>.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Link to="/" className="w-full">
                                            <Button
                                                gradientDuoTone="pinkToOrange"
                                                className="w-full"
                                            >
                                                Volver al Inicio
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

export default FalloPago;
