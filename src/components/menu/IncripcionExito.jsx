// InscripcionExitosa.jsx
import { Link, useSearchParams } from 'react-router-dom';
import { Card, Button } from 'flowbite-react';
import { HiOutlineCheckCircle, HiOutlineLocationMarker, HiOutlineClock, HiOutlineTicket, HiOutlineCalendar } from 'react-icons/hi';
import { FaRunning, FaTrophy, FaMedal } from 'react-icons/fa';
import Logo10K from "../../assets/img/10k.png";
import RunnerBanner from "../../assets/img/runner-banner.jpg";
import Footer from '../Footer';
import { useEffect } from 'react';

const InscripcionExitosa = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const updatePago = async () => {
            try {
                const paramsString = searchParams.toString();
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/mp/success?${paramsString}`);
                const json = await response.json();
                console.log(json);
            } catch (error) {
                console.log(error);
            }
        };
        updatePago();
    }, [searchParams]);

    const features = [
        { icon: FaRunning, text: 'Distancias 5K y 10K', color: 'text-blue-400' },
        { icon: FaMedal, text: 'Premios y medallas', color: 'text-yellow-400' },
        { icon: HiOutlineTicket, text: 'Kit del corredor', color: 'text-emerald-400' },
    ];

    const recommendations = [
        { icon: HiOutlineTicket, text: "Recordá llevar tu inscripción con QR digital o impresa." },
        { icon: HiOutlineClock, text: "Llegá temprano para el calentamiento y acreditaciones." },
        { icon: FaTrophy, text: "Participá en la premiación y sorteos especiales." },
        { icon: FaRunning, text: "Disfrutá de la experiencia y corré por la educación." }
    ];

    return (
        <main className="flex-1">
            <div className="min-h-screen w-full relative bg-slate-950 selection:bg-indigo-500/30 selection:text-white flex flex-col">
                {/* Fondo: imagen + gradiente */}
                <div className="absolute inset-0 z-0">
                    <img src={RunnerBanner} alt="Running Background" className="w-full h-full object-cover" loading="eager" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-green-900/70 to-emerald-700/40" />
                    <div className="absolute inset-0 backdrop-blur-[1px]" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col">
                    {/* Contenido principal */}
                    <div className="flex-1 flex items-center justify-center px-4 py-8">
                        <div className="max-w-7xl w-full mx-auto">
                            {/* MISMA ALTURA Y CENTRADOS */}
                            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                                {/* IZQUIERDA */}
                                <section className="text-white h-full">
                                    {/* Contenedor igual al formulario */}
                                    <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/25 shadow-2xl min-h-[620px] h-full flex flex-col">
                                        {/* Logo grande y centrado */}
                                        <div className="flex items-center justify-center mb-6">
                                            <img
                                                src={Logo10K}
                                                alt="Logo 10K del Maestro"
                                                className="h-32 md:h-40 lg:h-48 xl:h-52 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300 filter brightness-110"
                                            />
                                        </div>

                                        {/* Info evento */}
                                        <div className="space-y-5 flex-1 flex flex-col justify-start">
                                            {/* Título de éxito */}
                                            <div className="text-center space-y-4">
                                                <div className="flex items-center justify-center gap-4">
                                                    <div className="h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent flex-1"></div>
                                                    <div className="w-2 h-2 bg-green-400/60 rounded-full"></div>
                                                    <div className="h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent flex-1"></div>
                                                </div>

                                                <div className="flex items-center justify-center gap-3">
                                                    <HiOutlineCheckCircle className="w-8 h-8 text-green-400" />
                                                    <span className="text-xl md:text-2xl font-bold text-green-200">¡Inscripción Exitosa!</span>
                                                </div>

                                                <div className="flex items-center justify-center gap-3">
                                                    <HiOutlineCalendar className="w-6 h-6 text-blue-300" />
                                                    <span className="text-lg md:text-xl font-semibold text-blue-100">7 de Septiembre 2025</span>
                                                </div>
                                            </div>

                                            {/* Info del evento */}
                                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/15">
                                                <h3 className="text-lg font-bold mb-4 text-center">Te esperamos en</h3>
                                                <div className="space-y-3">
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold text-emerald-300">San Francisco del Monte de Oro</div>
                                                        <div className="text-sm text-blue-200 font-medium">Largada desde las 07:30hs</div>
                                                    </div>
                                                </div>
                                                <p className="text-center text-xs text-blue-200/80 mt-3">En minutos recibirás tus inscripciones por email</p>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="grid grid-cols-3 gap-3 mt-6">
                                            {features.map((f, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-3 border border-white/15 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group text-center"
                                                >
                                                    <f.icon className={`w-5 h-5 ${f.color} mb-2 drop-shadow group-hover:scale-110 transition-transform mx-auto`} />
                                                    <p className="text-xs font-semibold text-white leading-tight">{f.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* DERECHA */}
                                <aside className="w-full h-full">
                                    <Card className="backdrop-blur-2xl bg-white/95 shadow-[0_20px_70px_rgba(0,0,0,0.3)] border border-white/60 w-full rounded-3xl min-h-[620px] h-full flex">
                                        <div className="p-6 flex flex-col justify-between w-full">
                                            <div className="space-y-6">
                                                <div className="text-center">
                                                    <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-2xl bg-green-100 mb-6">
                                                        <HiOutlineCheckCircle className="w-12 h-12 text-green-600" />
                                                    </div>
                                                    
                                                    <h2 className="text-3xl font-black text-center bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                                                        ¡Ya tenés tu inscripción!
                                                    </h2>
                                                    <p className="text-gray-600 mb-6">
                                                        Ya sos parte del 10K del Maestro. En minutos recibirás tus inscripciones en el correo o ingresá a "Mis Inscripciones" para descargarlas.
                                                    </p>
                                                </div>

                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <h3 className="font-semibold text-green-800 mb-3">Información importante:</h3>
                                                    <div className="space-y-3">
                                                        {recommendations.map((item, index) => (
                                                            <div key={index} className="flex items-start space-x-3 text-sm text-green-700">
                                                                <item.icon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                                <span>{item.text}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Link to="/" className="w-full">
                                                    <Button
                                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-green-300"
                                                    >
                                                        Ir al Inicio
                                                    </Button>
                                                </Link>
                                            </div>

                                            <div className="text-center text-sm text-gray-500">
                                                Si necesitas ayuda, por favor <a href="https://instagram.com/codeo.ar" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700 underline">contáctanos en Instagram</a>.
                                            </div>
                                        </div>
                                    </Card>
                                </aside>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10">
                        <Footer />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default InscripcionExitosa;