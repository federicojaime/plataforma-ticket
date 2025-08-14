import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import FestivalBanner from "../../assets/img/festival.jpg";
import {
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineExclamationCircle,
    HiOutlineTicket
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import SkeletonLoader from '../ui/Skeletor';

const Evento = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tickets, setTickets] = useState({
        day1: 0,
        day2: 0
    });
    const [idPreferencia, setIdPreferencia] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mpInitialized, setMpInitialized] = useState(false);

    const PRICES = {
        day1: 15000,
        day2: 8000
    };

    const MAX_TICKETS_PER_DAY = 5;

    // Inicializar MercadoPago
    useEffect(() => {
        const initializeMp = async () => {
            try {
                initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
                setMpInitialized(true);
            } catch (error) {
                console.error('Error initializing MercadoPago:', error);
                toast.error('Error al inicializar el sistema de pago');
            }
        };
        initializeMp();
    }, []);

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

    const handleTicketChange = (day, increment) => {
        const newTicketCount = tickets[day] + increment;

        // Check if trying to exceed maximum tickets
        if (increment > 0 && newTicketCount > MAX_TICKETS_PER_DAY) {
            toast.warning(`No puedes comprar más de ${MAX_TICKETS_PER_DAY} entradas por día`);
            return;
        }

        setTickets(prev => ({
            ...prev,
            [day]: Math.max(0, newTicketCount)
        }));

        // Reset preference ID when tickets change
        if (idPreferencia) {
            setIdPreferencia(null);
        }
    };

    const totalAmount = (tickets.day1 * PRICES.day1) + (tickets.day2 * PRICES.day2);

    const handleCheckout = async () => {
        if (isProcessing) return;

        if (tickets.day1 === 0 && tickets.day2 === 0) {
            toast.warning("Debes seleccionar al menos una entrada.");
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const token = user?.jwt?.startsWith('Bearer ') ? user.jwt : `Bearer ${user.jwt}`;

            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/evento/crear-preferencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    tickets: {
                        day1: tickets.day1,
                        day2: tickets.day2
                    }
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Error de autenticación. Por favor, inicia sesión nuevamente.');
                    navigate('/login');
                    return;
                }
                throw new Error('Error al procesar la compra');
            }

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.msg || 'Error al crear la preferencia de pago');
            }

            if (!data.data?.preferenceId) {
                throw new Error('Respuesta inválida del servidor');
            }

            setIdPreferencia(data.data.preferenceId);
            toast.success('Perfecto, ahora hacé click y pagá con Mercado Pago.');

        } catch (error) {
            console.error('Error al procesar la compra:', error);
            toast.error(error.message || 'Error al procesar la compra. Por favor, intenta más tarde.');
            setError('Hubo un error al procesar la compra. Por favor, intenta más tarde.');
        } finally {
            setIsProcessing(false);
        }
    };

    const onMercadoPagoError = (error) => {
        console.error('Error en MercadoPago:', error);
        toast.error('Error en el proceso de pago');
        navigate('/fallo-pago');
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

    const renderPaymentButton = () => {
        if (idPreferencia && mpInitialized) {
            return (
                <div className="w-full">
                    <Wallet
                        initialization={{ preferenceId: idPreferencia }}
                        customization={{
                            texts: {
                                action: 'Pagar la compra',
                                valueProp: 'Pago seguro con Mercado Pago'
                            },
                            visual: {
                                buttonBackground: '#17b1be',
                                borderRadius: '8px'
                            }
                        }}
                        onError={onMercadoPagoError}
                    />
                </div>
            );
        }

        if (idPreferencia && !mpInitialized) {
            return (
                <div className="w-full text-center p-4">
                    <div className="animate-pulse flex justify-center items-center gap-2">
                        <div className="w-5 h-5 border-2 border-[#17b1be] border-t-transparent rounded-full animate-spin"></div>
                        <span>Cargando método de pago...</span>
                    </div>
                </div>
            );
        }

        return (
            <button
                className="w-full bg-[#17b1be] hover:bg-[#17b1be]/90 text-white py-3.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCheckout}
                disabled={isProcessing || totalAmount === 0}
            >
                {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Procesando...</span>
                    </div>
                ) : (
                    'Continuar compra'
                )}
            </button>
        );
    };

    return (
        <div className="bg-gray-50/80">
            {/* Banner para PC */}
            <div className="hidden md:block relative h-[25vh] w-full mb-4">
                <img
                    src={FestivalBanner}
                    alt="Festival Provincial del Artesano"
                    className="w-full h-full object-cover object-left-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00263b]/60 to-[#00263b]/30">
                    <div className="h-full max-w-5xl mx-auto px-4 flex flex-col justify-end pb-6">
                        <div className="inline-flex items-center gap-2 text-[#17b1be] mb-2">
                            <HiOutlineCalendar className="w-5 h-5" />
                            <span>2 y 3 de Enero de 2025</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">
                            36° Festival Provincial del Artesano
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        {/* Día 1 */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="border-l-4 border-[#f9b603] px-6 py-5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-[#00263b]">Jueves 2 de Enero</h3>
                                            <span className="text-xs font-medium text-[#17b1be] bg-[#17b1be]/10 px-2 py-1 rounded-full">
                                                Disponible
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">Primer día del festival</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="text-2xl font-bold text-[#00263b]">${PRICES.day1}</p>
                                        <div className="flex items-center bg-gray-50 rounded-xl">
                                            <button
                                                onClick={() => handleTicketChange('day1', -1)}
                                                className="w-10 h-10 flex items-center justify-center text-[#00263b] hover:text-[#17b1be] transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="w-12 text-center font-medium text-[#00263b]">
                                                {tickets.day1}
                                            </span>
                                            <button
                                                onClick={() => handleTicketChange('day1', 1)}
                                                className="w-10 h-10 flex items-center justify-center text-[#00263b] hover:text-[#17b1be] transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Día 2 */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="border-l-4 border-[#17b1be] px-6 py-5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-[#00263b]">Viernes 3 de Enero</h3>
                                            <span className="text-xs font-medium text-[#17b1be] bg-[#17b1be]/10 px-2 py-1 rounded-full">
                                                Disponible
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">Segundo día del festival</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="text-2xl font-bold text-[#00263b]">${PRICES.day2}</p>
                                        <div className="flex items-center bg-gray-50 rounded-xl">
                                            <button
                                                onClick={() => handleTicketChange('day2', -1)}
                                                className="w-10 h-10 flex items-center justify-center text-[#00263b] hover:text-[#17b1be] transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="w-12 text-center font-medium text-[#00263b]">
                                                {tickets.day2}
                                            </span>
                                            <button
                                                onClick={() => handleTicketChange('day2', 1)}
                                                className="w-10 h-10 flex items-center justify-center text-[#00263b] hover:text-[#17b1be] transition-colors"
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
                    <div className="md:col-span-1">
                        <div className="bg-[#00263b] text-white rounded-2xl shadow-lg p-6 sticky top-4">
                            <div className="space-y-6 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#17b1be]/10 flex items-center justify-center">
                                        <HiOutlineLocationMarker className="w-5 h-5 text-[#17b1be]" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Polideportivo Municipal</p>
                                        <p className="text-sm text-gray-400">San Francisco del Monte de Oro</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#17b1be]/10 flex items-center justify-center">
                                        <HiOutlineClock className="w-5 h-5 text-[#17b1be]" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Desde las 20:00hs</p>
                                        <p className="text-sm text-gray-400">en adelante</p>
                                    </div>
                                </div>
                            </div>

                            {(tickets.day1 > 0 || tickets.day2 > 0) && (
                                <>
                                    <div className="border-t border-white/10 pt-6 mb-6">
                                        <h4 className="flex items-center gap-2 font-medium mb-4">
                                            <HiOutlineTicket className="w-5 h-5 text-[#17b1be]" />
                                            <span>Resumen de compra</span>
                                        </h4>
                                        {tickets.day1 > 0 && (
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-400">2 de Enero × {tickets.day1}</span>
                                                <span>${tickets.day1 * PRICES.day1}</span>
                                            </div>
                                        )}
                                        {tickets.day2 > 0 && (
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-400">3 de Enero × {tickets.day2}</span>
                                                <span>${tickets.day2 * PRICES.day2}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold text-lg mt-4">
                                            <span>Total</span>
                                            <span>${totalAmount}</span>
                                        </div>
                                    </div>

                                    {renderPaymentButton()}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Banner para móvil */}
                <div className="md:hidden relative h-[20vh] w-full mb-4 mt-4 rounded-lg">
                    <img src={FestivalBanner} alt="Festival Provincial del Artesano" className="w-full h-full object-cover object-left-top rounded-lg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00263b]/60 to-[#00263b]/30">
                        <div className="h-full max-w-5xl mx-auto px-4 flex flex-col justify-end pb-6">
                            <div className="inline-flex items-center gap-2 text-[#17b1be] mb-2">
                                <HiOutlineCalendar className="w-5 h-5" />
                                <span>2 y 3 de Enero de 2025</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white">
                                36° Festival Provincial del Artesano
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Evento;