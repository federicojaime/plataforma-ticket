// PendientePago.jsx
import { Link } from 'react-router-dom';
import { Card, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiOutlineSupport } from 'react-icons/hi';
import Logo from "../../assets/img/logo_blanco.png";
import EventoBanner from "../../assets/img/festival.jpg";
import Footer from '../Footer';

const PendientePago = () => {
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
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-amber-800/50 to-amber-700/20 backdrop-blur-sm"></div>
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
                                    <div className="flex flex-col items-center space-y-4">
                                        <HiOutlineExclamationCircle className="w-20 h-20 text-amber-500" />
                                        <h2 className="text-2xl md:text-3xl font-bold text-amber-700 text-center">
                                            Pago Pendiente
                                        </h2>
                                        <div className="text-center space-y-2">
                                            <p className="text-gray-700">
                                                Tu pago para el Festival del Artesano está pendiente. Por favor, espera un momento mientras se procesa.
                                            </p>
                                            <p className="text-gray-700">
                                                Si el pago no se refleja en unos minutos, contactá a nuestro equipo de soporte.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                        <div className="flex items-center text-amber-800">
                                            <HiOutlineSupport className="w-5 h-5 mr-2" />
                                            <span className="text-sm">
                                                Si necesitas ayuda, por favor <a href="https://instagram.com/codeo.ar" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 underline">dejanos un mensaje</a>.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Link to="/" className="w-full">
                                            <Button
                                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold"
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

export default PendientePago;
