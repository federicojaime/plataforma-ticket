// NotFound404.jsx
import { Link } from 'react-router-dom';
import { Card, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiOutlineArrowLeft, HiOutlineLocationMarker, HiOutlineCalendar } from 'react-icons/hi';
import { FaTrophy } from 'react-icons/fa';
import Logo10K from "../assets/img/10k.png";
import RunnerBanner from "../assets/img/runner-banner.jpg";
import Footer from './Footer';

const NotFound404 = () => {
    const features = [
        { icon: HiOutlineLocationMarker, text: 'San Francisco del Monte de Oro', color: 'text-emerald-400' },
        { icon: FaTrophy, text: 'Premios y medallas', color: 'text-yellow-400' },
        { icon: HiOutlineCalendar, text: '7 de Septiembre 2025', color: 'text-blue-400' },
    ];

    return (
        <main className="flex-1">
            <div className="min-h-screen w-full relative bg-slate-950 selection:bg-indigo-500/30 selection:text-white flex flex-col">
                {/* Fondo: imagen + gradiente */}
                <div className="absolute inset-0 z-0">
                    <img src={RunnerBanner} alt="Running Background" className="w-full h-full object-cover" loading="eager" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-red-900/70 to-orange-700/40" />
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
                                            {/* Título de error */}
                                            <div className="text-center space-y-4">
                                                <div className="flex items-center justify-center gap-4">
                                                    <div className="h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent flex-1"></div>
                                                    <div className="w-2 h-2 bg-red-400/60 rounded-full"></div>
                                                    <div className="h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent flex-1"></div>
                                                </div>

                                                <div className="flex items-center justify-center gap-3">
                                                    <HiOutlineExclamationCircle className="w-8 h-8 text-red-400" />
                                                    <span className="text-xl md:text-2xl font-bold text-red-200">Página No Encontrada</span>
                                                </div>
                                            </div>

                                            {/* Info del evento */}
                                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/15">
                                                <h3 className="text-lg font-bold mb-4 text-center">¿Buscabas información del evento?</h3>
                                                <div className="space-y-3">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-black text-sky-300 drop-shadow-lg">10K del Maestro</div>
                                                        <div className="text-sm text-blue-200 font-medium">7 de Septiembre 2025</div>
                                                    </div>
                                                </div>
                                                <p className="text-center text-xs text-blue-200/80 mt-3">Volvé al inicio para inscribirte</p>
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
                                        <div className="p-6 flex flex-col justify-center w-full">
                                            <div className="space-y-6 text-center">
                                                <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-2xl bg-red-100">
                                                    <HiOutlineExclamationCircle className="w-12 h-12 text-red-600" />
                                                </div>
                                                
                                                <div>
                                                    <h2 className="text-3xl font-black text-center bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
                                                        Error 404
                                                    </h2>
                                                    <p className="text-gray-600 mb-4">
                                                        La página que estás buscando no existe.
                                                    </p>
                                                    <p className="text-gray-600 mb-6">
                                                        Es posible que hayas escrito mal la dirección o que la página se haya movido.
                                                    </p>
                                                </div>

                                                <Link to="/" className="w-full">
                                                    <Button
                                                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-red-300"
                                                    >
                                                        <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
                                                        Volver al Inicio
                                                    </Button>
                                                </Link>

                                                <div className="text-center text-sm text-gray-500 mt-6">
                                                    Si necesitas ayuda, por favor <a href="https://instagram.com/codeo.ar" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-700 underline">contáctanos en Instagram</a>.
                                                </div>
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

export default NotFound404;