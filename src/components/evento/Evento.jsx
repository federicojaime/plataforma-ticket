import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RunnerBanner from "../../assets/img/runner-banner.jpg";
import {
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineExclamationCircle,
    HiOutlineTicket,
    HiOutlineUsers
} from "react-icons/hi";
import { HiOutlineTrophy } from 'react-icons/hi2';
import { FaRunning, FaMedal, FaTshirt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import SkeletonLoader from '../ui/Skeletor';

const Evento = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inscripciones, setInscripciones] = useState({
        '5k': 0,
        '10k': 0
    });

    const PRICES = {
        '5k': 8000,
        '10k': 12000
    };

    const MAX_INSCRIPCIONES = 3;

    // Verificar autenticación
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!user?.jwt) {
                    setError('Usuario no autenticado.');
                }
                setLoading(false);
            } catch (error) {
                setError('Error al verificar la autenticación');
                setLoading(false);
            }
        };
        checkAuth();
    }, [user]);

    const handleInscripcionChange = (distancia, increment) => {
        const newCount = inscripciones[distancia] + increment;

        // Check if trying to exceed maximum inscripciones
        if (increment > 0 && newCount > MAX_INSCRIPCIONES) {
            toast.warning(`No puedes inscribir más de ${MAX_INSCRIPCIONES} personas por distancia`);
            return;
        }

        setInscripciones(prev => ({
            ...prev,
            [distancia]: Math.max(0, newCount)
        }));

        // Reset any saved data when inscripciones change
        if (localStorage.getItem('inscripciones-seleccionadas')) {
            localStorage.removeItem('inscripciones-seleccionadas');
        }
    };

    const totalAmount = (inscripciones['5k'] * PRICES['5k']) + (inscripciones['10k'] * PRICES['10k']);
    const totalPersonas = inscripciones['5k'] + inscripciones['10k'];

    const handleContinuar = () => {
        if (inscripciones['5k'] === 0 && inscripciones['10k'] === 0) {
            toast.warning("Debes seleccionar al menos una inscripción.");
            return;
        }

        // Guardar las inscripciones seleccionadas en localStorage para pasarlas al formulario
        localStorage.setItem('inscripciones-seleccionadas', JSON.stringify({
            '5k': inscripciones['5k'],
            '10k': inscripciones['10k'],
            precios: PRICES,
            total: totalAmount
        }));

        // Navegar al formulario de datos
        navigate('/registrar_compra');
    };



    if (loading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                <div className="bg-white rounded-xl shadow-sm p-6 max-w-md w-full text-center">
                    <div className="bg-red-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <HiOutlineExclamationCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#00263b] mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <a href="https://instagram.com/codeo.ar"
                        className="text-[#17b1be] hover:text-[#00263b] transition-colors">
                        Contactar soporte
                    </a>
                </div>
            </div>
        );
    }

    const renderContinueButton = () => {
        return (
            <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                onClick={handleContinuar}
                disabled={totalAmount === 0}
            >
                Continuar con la inscripción
            </button>
        );
    };

    return (
        <div className="bg-gray-50/80">
            {/* Banner Hero */}
            <div className="relative h-[40vh] w-full mb-8 overflow-hidden rounded-2xl">
                <img
                    src={RunnerBanner}
                    alt="10K del Maestro"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-blue-900/60">
                    <div className="h-full max-w-6xl mx-auto px-6 flex flex-col justify-end pb-8">
                        <div className="text-white space-y-4">
                            <div className="inline-flex items-center gap-2 text-blue-300 mb-2">
                                <HiOutlineCalendar className="w-5 h-5" />
                                <span className="text-lg font-semibold">7 de Septiembre 2025</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black leading-tight">
                                ¡Inscribite al 10K del Maestro!
                            </h1>
                            <p className="text-xl text-blue-100 max-w-2xl">
                                Elegí tu distancia, completá el pago y prepárate para vivir una experiencia única corriendo por la educación.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* 5K Recreativa */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="border-l-4 border-blue-500 px-8 py-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                                            <FaRunning className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold text-gray-900">5K Recreativa</h3>
                                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                                    Disponible
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">Perfecta para principiantes y familias</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <FaTshirt className="w-4 h-4" />
                                                    Remera técnica
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaMedal className="w-4 h-4" />
                                                    Medalla finisher
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="text-3xl font-black text-blue-600">${PRICES['5k'].toLocaleString()}</p>
                                        <div className="flex items-center bg-gray-100 rounded-xl">
                                            <button
                                                onClick={() => handleInscripcionChange('5k', -1)}
                                                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors text-xl font-bold"
                                            >
                                                −
                                            </button>
                                            <span className="w-12 text-center font-bold text-gray-900 text-lg">
                                                {inscripciones['5k']}
                                            </span>
                                            <button
                                                onClick={() => handleInscripcionChange('5k', 1)}
                                                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors text-xl font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 10K Competitiva */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="border-l-4 border-purple-500 px-8 py-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                                            <HiOutlineTrophy className="w-8 h-8 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold text-gray-900">10K Competitiva</h3>
                                                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                                                    Disponible
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">Con cronometraje oficial y premiación</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <FaTshirt className="w-4 h-4" />
                                                    Remera técnica
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaMedal className="w-4 h-4" />
                                                    Medalla + Premio
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="text-3xl font-black text-purple-600">${PRICES['10k'].toLocaleString()}</p>
                                        <div className="flex items-center bg-gray-100 rounded-xl">
                                            <button
                                                onClick={() => handleInscripcionChange('10k', -1)}
                                                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-purple-600 transition-colors text-xl font-bold"
                                            >
                                                −
                                            </button>
                                            <span className="w-12 text-center font-bold text-gray-900 text-lg">
                                                {inscripciones['10k']}
                                            </span>
                                            <button
                                                onClick={() => handleInscripcionChange('10k', 1)}
                                                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-purple-600 transition-colors text-xl font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen y Checkout */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl p-8 sticky top-4">
                            <div className="space-y-6 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <HiOutlineLocationMarker className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Lugar de largada</p>
                                        <p className="text-sm text-gray-300">San Francisco del Monte de Oro</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                        <HiOutlineClock className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Horarios</p>
                                        <p className="text-sm text-gray-300">10K: 07:30hs • 5K: 08:00hs</p>
                                    </div>
                                </div>
                            </div>

                            {totalPersonas > 0 && (
                                <>
                                    <div className="border-t border-gray-600 pt-6 mb-6">
                                        <h4 className="flex items-center gap-2 font-bold mb-4">
                                            <HiOutlineTicket className="w-5 h-5 text-blue-400" />
                                            <span>Resumen de inscripción</span>
                                        </h4>
                                        {inscripciones['5k'] > 0 && (
                                            <div className="flex justify-between text-sm mb-3">
                                                <span className="text-gray-300">5K Recreativa × {inscripciones['5k']}</span>
                                                <span className="font-semibold">${(inscripciones['5k'] * PRICES['5k']).toLocaleString()}</span>
                                            </div>
                                        )}
                                        {inscripciones['10k'] > 0 && (
                                            <div className="flex justify-between text-sm mb-3">
                                                <span className="text-gray-300">10K Competitiva × {inscripciones['10k']}</span>
                                                <span className="font-semibold">${(inscripciones['10k'] * PRICES['10k']).toLocaleString()}</span>
                                            </div>
                                        )}
                                        
                                        <div className="border-t border-gray-600 pt-4 mt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-300">
                                                    <HiOutlineUsers className="inline w-4 h-4 mr-1" />
                                                    Total personas: {totalPersonas}
                                                </span>
                                            </div>
                                            <div className="flex justify-between font-bold text-xl">
                                                <span>Total a pagar</span>
                                                <span className="text-blue-400">${totalAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {renderContinueButton()}
                                </>
                            )}

                            {totalPersonas === 0 && (
                                <div className="text-center py-8">
                                    <FaRunning className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-400">Selecciona las inscripciones que deseas realizar</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Evento;