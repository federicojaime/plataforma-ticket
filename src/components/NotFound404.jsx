// NotFound.jsx
import { Link } from 'react-router-dom';
import { Card, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiOutlineArrowLeft } from 'react-icons/hi';
import Logo from "../assets/img/logo_blanco.png";
import EventoBanner from "../assets/img/festival.jpg";
import Footer from './Footer';

const NotFound = () => {
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
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/50 to-gray-700/20 backdrop-blur-sm"></div>
                </div>

                {/* Contenido */}
                <div className="relative z-10 w-full h-full py-8 px-4 md:py-12 flex flex-col items-center">
                    <div className="w-full max-w-screen-md p-6 mb-8">
                        <img src={Logo} alt="Logo" className="mx-auto h-20 object-contain" />
                    </div>

                    <Card className="w-full max-w-screen-md backdrop-blur-xl bg-white/95 shadow-2xl border-none">
                        <div className="space-y-6 p-4 md:p-6">
                            <div className="flex flex-col items-center space-y-6">
                                <HiOutlineExclamationCircle className="w-20 h-20 text-red-500" />
                                <h2 className="text-3xl font-bold text-red-700 text-center">Página No Encontrada</h2>
                                <p className="font-normal text-gray-600 text-center">
                                    La página que estás buscando no existe.
                                </p>
                                <p className="font-normal text-gray-600 text-center">
                                    Es posible que hayas escrito mal la dirección o que la página se haya movido.
                                </p>
                            </div>

                            <div className="flex justify-center mt-4">
                                <Link to="/" className="w-full">
                                    <Button
                                        gradientDuoTone="pinkToOrange"
                                        className="w-full flex items-center justify-center"
                                    >
                                        <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
                                        Volver al Inicio
                                    </Button>
                                </Link>
                            </div>

                            {/* Texto pequeño de contacto */}
                            <div className="text-center text-sm text-gray-500 mt-4">
                                Si necesitas ayuda, por favor <a href="https://instagram.com/codeo.ar" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">contáctanos en Instagram</a>.
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default NotFound;
