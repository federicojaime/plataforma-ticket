import { Link } from 'react-router-dom';
import { Card, Button } from 'flowbite-react';
import { HiOutlineMail, HiOutlineExclamationCircle, HiOutlineCheckCircle } from 'react-icons/hi';
import Logo from "../../assets/img/logo_blanco.png";
import EventoBanner from "../../assets/img/festival.jpg";
import Footer from '../Footer';

const RegistroExitoso = () => {
    const features = [
        { icon: HiOutlineMail, text: "Revisa tu correo", color: "text-cyan-600" },
        { icon: HiOutlineCheckCircle, text: "Verifica tu cuenta", color: "text-amber-500" },
        { icon: HiOutlineExclamationCircle, text: "¡Y listo!", color: "text-emerald-500" }
    ];

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
                                    ¡Registro Exitoso!
                                </h1>
                                <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8">
                                    Estás a un paso de ser parte del festival
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 hover:bg-white/20 transition-all"
                                    >
                                        <feature.icon className={`w-6 h-6 md:w-8 md:h-8 ${feature.color} mb-3 md:mb-4`} />
                                        <p className="text-base md:text-lg font-medium">{feature.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sección Derecha */}
                        <div className="w-full lg:w-1/2 max-w-md">
                            <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-none w-full">
                                <div className="space-y-6 p-4 md:p-6">
                                    <div className="flex flex-col items-center space-y-6">
                                        <HiOutlineMail className="w-20 h-20 text-cyan-600" />
                                        <div className="text-center space-y-2">
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                                Revisa tu correo
                                            </h2>
                                            <p className="text-gray-600">
                                                Se ha enviado un enlace de verificación a tu correo electrónico.
                                            </p>
                                            <p className="text-gray-600">
                                                Por favor, verifica tu cuenta para poder ingresar al sistema.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                                        <div className="flex items-center text-cyan-800">
                                            <HiOutlineExclamationCircle className="w-5 h-5 mr-2" />
                                            <span className="text-sm">
                                                Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                                            </span>
                                        </div>
                                    </div>

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

export default RegistroExitoso;