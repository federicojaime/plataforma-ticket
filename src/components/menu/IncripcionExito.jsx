// InscripcionExitosa.jsx
import { Link, useSearchParams } from 'react-router-dom';
import { Card, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiOutlineLocationMarker, HiOutlineClock, HiOutlineTicket } from 'react-icons/hi';
import { FaStore, FaParking, FaGlassCheers } from 'react-icons/fa';
import Logo from "../../assets/img/logo_blanco.png";
import EventoBanner from "../../assets/img/festival.jpg";
import Footer from '../Footer';
import { useEffect } from 'react';
import { VITE_BACK_END_URL } from '../../../config';

const InscripcionExitosa = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const updatePago = async () => {
            try {
                const paramsString = searchParams.toString();
                const response = await fetch(`${VITE_BACK_END_URL}mp/success?${paramsString}`);
                const json = await response.json();
                console.log(json);
            } catch (error) {
                console.log(error);
            }
        };
        updatePago();
    }, [searchParams]);

    const recommendations = [
        { icon: FaParking, text: "Estacioná en las áreas designadas y despreocupate." },
        { icon: FaStore, text: "Recorré los stands de artesanos y descubrí productos únicos." },
        { icon: FaGlassCheers, text: "Disfrutá de la gastronomía local y los shows en vivo." },
        { icon: HiOutlineTicket, text: "Recordá llevar tu entrada con QR digital o impresa." }
    ];

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
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00263b]/90 via-[#4baccc]/50 to-[#e7ac2a]/20 backdrop-blur-sm"></div>
                </div>

                {/* Contenido */}
                <div className="relative z-10 w-full h-full py-8 px-4 md:py-12">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8">
                        {/* Sección Izquierda */}
                        <div className="w-full lg:w-1/2 text-white space-y-6">
                            <div className="text-center lg:text-left">
                                <img
                                    src={Logo}
                                    alt="Logo"
                                    className="h-16 md:h-24 mb-6 mx-auto lg:mx-0"
                                />
                                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                                    ¡Ya tenés tus entradas!
                                </h1>
                                <p className="text-xl text-gray-200">
                                    Ya sos parte del Festival del Artesano 2024.
                                </p>
                                <p className="text-lg text-gray-200 mt-4">
                                    En minutos recibirás tus entradas en el correo o ingresá a "Mis entradas" para descargarlas.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xl font-semibold">Te esperamos:</p>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <HiOutlineClock className="w-6 h-6 text-[#4baccc]" />
                                        <span className="text-xl">11 y 12 de Enero de 2024</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <HiOutlineLocationMarker className="w-6 h-6 text-[#4baccc]" />
                                        <span className="text-xl">Polideportivo Municipal de San Francisco del Monte de Oro</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección Derecha */}
                        <div className="w-full lg:w-1/2 max-w-xl">
                            <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-none">
                                <div className="space-y-6 p-4 md:p-6">
                                    <div className="flex flex-col items-center space-y-6">
                                        <FaStore className="w-20 h-20 text-[#4baccc]" />
                                        <h2 className="text-2xl font-bold text-[#00263b]">
                                            Información del Festival
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        {recommendations.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-3 p-3 bg-[#4baccc]/10 rounded-lg">
                                                <item.icon className="w-5 h-5 text-[#4baccc] flex-shrink-0" />
                                                <span className="text-gray-700">{item.text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4">
                                        <Link to="/" className="w-full">
                                            <Button
                                                gradientDuoTone="cyanToBlue"
                                                className="w-full"
                                            >
                                                Ir al Inicio
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

export default InscripcionExitosa;
