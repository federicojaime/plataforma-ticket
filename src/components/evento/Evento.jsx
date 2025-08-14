// src/components/evento/Evento.jsx - Corregido para categorías gratuitas
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
    HiOutlineUsers,
    HiOutlineHeart
} from "react-icons/hi";
import { HiOutlineTrophy } from 'react-icons/hi2';
import { FaRunning, FaMedal, FaTshirt, FaChild, FaWheelchair, FaCheck } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import SkeletonLoader from '../ui/Skeletor';

const Evento = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inscripciones, setInscripciones] = useState({
        '5k': 0,
        '10k': 0,
        'kid': 0,
        'discapacitado': 0
    });

    const PRICES = {
        '5k': 1,
        '10k': 2,
        'kid': 0,
        'discapacitado': 0
    };

    const CATEGORIES_INFO = {
        '5k': {
            name: '5K Categoría',
            description: 'Perfecta para principiantes y familias',
            icon: FaRunning,
            color: 'blue',
            includes: [
                { icon: FaTshirt, text: 'Remera técnica' },
                { icon: FaMedal, text: 'Medalla finisher' }
            ]
        },
        '10k': {
            name: '10K Categoría',
            description: 'Con cronometraje oficial y premiación',
            icon: HiOutlineTrophy,
            color: 'purple',
            includes: [
                { icon: FaTshirt, text: 'Remera técnica' },
                { icon: FaMedal, text: 'Medalla + Premio' }
            ]
        },
        'kid': {
            name: 'Categoría Kids (hasta 14 años)',
            description: 'Distancia especial para los más pequeños - ¡GRATUITA!',
            icon: FaChild,
            color: 'green',
            includes: [
                { icon: FaCheck, text: 'Solo participación' }
            ]
        },
        'discapacitado': {
            name: 'Categoría Inclusiva',
            description: 'Para personas con discapacidad - ¡GRATUITA!',
            icon: FaWheelchair,
            color: 'orange',
            includes: [
                { icon: FaCheck, text: 'Solo participación' },
                { icon: FaWheelchair, text: 'Asistencia especializada' }
            ]
        }
    };

    const MAX_INSCRIPCIONES = 5; // Aumentado para permitir más inscripciones

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
            toast.warning(`No puedes inscribir más de ${MAX_INSCRIPCIONES} personas por categoría`);
            return;
        }

        // Permitir valores de 0 o mayores
        if (newCount < 0) {
            return;
        }

        setInscripciones(prev => ({
            ...prev,
            [distancia]: newCount
        }));

        // Reset any saved data when inscripciones change
        if (localStorage.getItem('inscripciones-seleccionadas')) {
            localStorage.removeItem('inscripciones-seleccionadas');
        }
    };

    const totalAmount = Object.keys(inscripciones).reduce((total, key) => {
        return total + (inscripciones[key] * PRICES[key]);
    }, 0);

    const totalPersonas = Object.values(inscripciones).reduce((total, count) => total + count, 0);

    const handleContinuar = () => {
        if (totalPersonas === 0) {
            toast.warning("Debes seleccionar al menos una inscripción.");
            return;
        }

        // Guardar las inscripciones seleccionadas en localStorage para pasarlas al formulario
        localStorage.setItem('inscripciones-seleccionadas', JSON.stringify({
            ...inscripciones,
            precios: PRICES,
            total: totalAmount
        }));

        // Navegar al formulario de datos
        navigate('/registrar_compra');
    };

    const getColorClasses = (color) => {
        const colorMap = {
            blue: {
                border: 'border-blue-500',
                bg: 'bg-blue-100',
                text: 'text-blue-600',
                price: 'text-blue-600',
                hover: 'hover:text-blue-600'
            },
            purple: {
                border: 'border-purple-500',
                bg: 'bg-purple-100',
                text: 'text-purple-600',
                price: 'text-purple-600',
                hover: 'hover:text-purple-600'
            },
            green: {
                border: 'border-green-500',
                bg: 'bg-green-100',
                text: 'text-green-600',
                price: 'text-green-600',
                hover: 'hover:text-green-600'
            },
            orange: {
                border: 'border-orange-500',
                bg: 'bg-orange-100',
                text: 'text-orange-600',
                price: 'text-orange-600',
                hover: 'hover:text-orange-600'
            }
        };
        return colorMap[color] || colorMap.blue;
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg touch-manipulation"
                onClick={handleContinuar}
                disabled={totalPersonas === 0}
            >
                Continuar con la inscripción
            </button>
        );
    };

    const renderCategoryCard = (categoryKey) => {
        const category = CATEGORIES_INFO[categoryKey];
        const colors = getColorClasses(category.color);
        const IconComponent = category.icon;
        const isGratuita = PRICES[categoryKey] === 0;

        return (
            <div key={categoryKey} className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`border-l-4 ${colors.border} px-4 sm:px-6 lg:px-8 py-4 sm:py-6`}>
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <div className="flex items-start gap-3 sm:gap-6">
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${colors.bg} rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0`}>
                                <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${colors.text}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{category.name}</h3>
                                    <span className={`text-xs font-medium ${colors.text} ${colors.bg} px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto`}>
                                        {isGratuita ? '¡GRATUITA!' : 'Disponible'}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                    {category.includes.map((item, index) => (
                                        <span key={index} className="flex items-center gap-1">
                                            <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {item.text}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            {isGratuita ? (
                                <div className="flex flex-col">
                                    <p className={`text-2xl sm:text-3xl font-black ${colors.price}`}>GRATUITA</p>
                                </div>
                            ) : (
                                <p className={`text-2xl sm:text-3xl font-black ${colors.price}`}>${PRICES[categoryKey].toLocaleString()}</p>
                            )}
                            <div className="flex items-center bg-gray-100 rounded-lg sm:rounded-xl">
                                <button
                                    onClick={() => handleInscripcionChange(categoryKey, -1)}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-600 ${colors.hover} transition-colors text-lg sm:text-xl font-bold touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed`}
                                    disabled={inscripciones[categoryKey] === 0}
                                >
                                    −
                                </button>
                                <span className="w-10 sm:w-12 text-center font-bold text-gray-900 text-base sm:text-lg">
                                    {inscripciones[categoryKey]}
                                </span>
                                <button
                                    onClick={() => handleInscripcionChange(categoryKey, 1)}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-600 ${colors.hover} transition-colors text-lg sm:text-xl font-bold touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed`}
                                    disabled={inscripciones[categoryKey] >= MAX_INSCRIPCIONES}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50/80 min-h-screen">
            {/* Banner Hero - Reducido en móvil */}
            <div className="relative h-[25vh] sm:h-[30vh] md:h-[40vh] w-full mb-6 sm:mb-8 overflow-hidden rounded-none sm:rounded-2xl">
                <img
                    src={RunnerBanner}
                    alt="10K del Maestro"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-blue-900/60">
                    <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-4 sm:pb-8">
                        <div className="text-white space-y-2 sm:space-y-4">
                            <div className="inline-flex items-center gap-2 text-blue-300 mb-1 sm:mb-2">
                                <HiOutlineCalendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-lg font-semibold">7 de Septiembre 2025</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black leading-tight">
                                ¡Inscribite al 10K del Maestro!
                            </h1>
                            <p className="text-sm sm:text-lg md:text-xl text-blue-100 max-w-2xl">
                                Elegí tu categoría, completá el pago y preparate para vivir una experiencia única corriendo por la educación.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Renderizar todas las categorías */}
                        {Object.keys(CATEGORIES_INFO).map(categoryKey => renderCategoryCard(categoryKey))}
                        
                        {/* Nota informativa sobre categorías gratuitas */}
                                                                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-green-200">
                            <div className="flex items-start gap-3">
                                <FaCheck className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-green-800 mb-2">Categorías Gratuitas</h3>
                                    <p className="text-green-700 text-sm">
                                        Las categorías <strong>Kids</strong> e <strong>Inclusiva</strong> son completamente gratuitas 
                                        e incluyen solo la participación en el evento. No incluyen remera técnica ni kit del corredor.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen y Checkout - Sticky en desktop, fijo abajo en móvil */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl lg:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 lg:sticky lg:top-4">
                            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg lg:rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <HiOutlineLocationMarker className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm sm:text-base">Lugar de largada</p>
                                        <p className="text-xs sm:text-sm text-gray-300">San Francisco del Monte de Oro</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg lg:rounded-xl bg-green-500/20 flex items-center justify-center">
                                        <HiOutlineClock className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm sm:text-base">Horarios</p>
                                        <p className="text-xs sm:text-sm text-gray-300">10K: 07:30hs • 5K: 08:00hs • Kids: 08:30hs</p>
                                    </div>
                                </div>
                            </div>

                            {totalPersonas > 0 && (
                                <>
                                    <div className="border-t border-gray-600 pt-4 sm:pt-6 mb-4 sm:mb-6">
                                        <h4 className="flex items-center gap-2 font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                                            <HiOutlineTicket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                                            <span>Resumen de inscripción</span>
                                        </h4>
                                        {Object.keys(inscripciones).map(key => {
                                            if (inscripciones[key] > 0) {
                                                const category = CATEGORIES_INFO[key];
                                                const isGratuita = PRICES[key] === 0;
                                                return (
                                                    <div key={key} className="flex justify-between text-xs sm:text-sm mb-2 sm:mb-3">
                                                        <span className="text-gray-300">
                                                            {category.name} × {inscripciones[key]}
                                                            {isGratuita && <span className="text-green-400 ml-1">(GRATUITA)</span>}
                                                        </span>
                                                        <span className="font-semibold">
                                                            {isGratuita ? 'GRATIS' : `$${(inscripciones[key] * PRICES[key]).toLocaleString()}`}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                        
                                        <div className="border-t border-gray-600 pt-3 sm:pt-4 mt-3 sm:mt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-300 text-xs sm:text-sm">
                                                    <HiOutlineUsers className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                    Total personas: {totalPersonas}
                                                </span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg sm:text-xl">
                                                <span>Total a pagar</span>
                                                <span className="text-blue-400">
                                                    {totalAmount === 0 ? 'GRATIS' : `${totalAmount.toLocaleString()}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {renderContinueButton()}
                                </>
                            )}

                            {totalPersonas === 0 && (
                                <div className="text-center py-6 sm:py-8">
                                    <FaRunning className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3 sm:mb-4" />
                                    <p className="text-gray-400 text-sm sm:text-base">Selecciona las inscripciones que deseas realizar</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón flotante para móvil cuando hay inscripciones */}
            {totalPersonas > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm text-gray-600">{totalPersonas} persona{totalPersonas > 1 ? 's' : ''}</p>
                            <p className="text-lg font-bold text-gray-900">
                                {totalAmount === 0 ? 'GRATIS' : `${totalAmount.toLocaleString()}`}
                            </p>
                        </div>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors touch-manipulation"
                            onClick={handleContinuar}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}

            {/* Espacio adicional en móvil para el botón flotante */}
            {totalPersonas > 0 && <div className="h-20 lg:hidden"></div>}
        </div>
    );
};

export default Evento;