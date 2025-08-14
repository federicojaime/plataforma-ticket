import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { HiOutlineTicket, HiOutlineInformationCircle, HiOutlinePrinter, HiOutlineCalendar, HiOutlineQrcode, HiOutlineUser, HiOutlinePhone } from "react-icons/hi";
import { FaRunning, FaMedal, FaTshirt, FaIdCard } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MisInscripciones = () => {
    const [loading, setLoading] = useState(true);
    const [inscripciones, setInscripciones] = useState([]);
    const [error, setError] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchInscripciones();
    }, [user]);

    const fetchInscripciones = async () => {
        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/carrera/mis-inscripciones`, {
                headers: {
                    'Authorization': user.jwt
                }
            });
            const data = await response.json();
            if (data.ok) {
                setInscripciones(data.data || []);
            } else {
                setError(data.msg);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al cargar las inscripciones');
        } finally {
            setLoading(false);
        }
    };

    const handleReprint = async (qrCode) => {
        let toastId = null;
        try {
            setIsPrinting(true);
            toastId = toast.loading('Generando entrada...');
            
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/carrera/reimprimir-entrada/${qrCode}`, {
                headers: {
                    'Authorization': user.jwt
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Error al generar la entrada');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `entrada-${qrCode}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.dismiss(toastId);
            toast.success('Entrada generada exitosamente');
        } catch (error) {
            console.error('Error:', error);
            if (toastId) {
                toast.dismiss(toastId);
            }
            toast.error(error.message || 'Error al generar la entrada');
        } finally {
            setIsPrinting(false);
        }
    };

    const handleReprintWithDebounce = (() => {
        let timeout;
        return (qrCode) => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                handleReprint(qrCode);
            }, 300);
        };
    })();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    const getDistanciaIcon = (distancia) => {
        return distancia === '10k' ? FaMedal : FaRunning;
    };

    const getDistanciaColor = (distancia) => {
        return distancia === '10k' ? 'text-purple-600' : 'text-blue-600';
    };

    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'pagado':
            case 'confirmed':
            case 'activo':
                return 'bg-green-100 text-green-800';
            case 'pendiente':
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelado':
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="animate-pulse space-y-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    {[1, 2].map((i) => (
                        <div key={i} className="border rounded-lg p-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                    <FaRunning size={24} className="text-blue-600" />
                    <span>Mis Inscripciones</span>
                </h2>
                <div className="text-sm text-gray-500">
                    10K del Maestro - 7 de Septiembre 2025
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    <div className="flex items-center">
                        <HiOutlineInformationCircle className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                </div>
            )}

            {inscripciones.length > 0 ? (
                <div className="space-y-6">
                    {inscripciones.map((inscripcion) => (
                        <div key={inscripcion.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Header de la inscripción */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <HiOutlineTicket className="text-blue-600" />
                                            Inscripción #{inscripcion.external_reference || inscripcion.id}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                            <HiOutlineCalendar className="text-gray-500" />
                                            {formatDate(inscripcion.created_at)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-blue-600">
                                            {formatAmount(inscripcion.total_amount)}
                                        </p>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(inscripcion.status)}`}>
                                            {inscripcion.status === 'confirmed' ? 'Confirmado' : 
                                             inscripcion.status === 'pending' ? 'Pendiente' : 
                                             inscripcion.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Participantes */}
                            <div className="p-4">
                                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <HiOutlineUser className="text-gray-600" />
                                    Participantes ({inscripcion.participantes?.length || 0})
                                </h4>
                                
                                <div className="grid gap-4 md:grid-cols-2">
                                    {inscripcion.participantes?.map((participante, index) => {
                                        const DistanciaIcon = getDistanciaIcon(participante.distancia);
                                        return (
                                            <div key={index} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                                                {/* Info del participante */}
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                                                            <FaIdCard className="text-gray-500 w-4 h-4" />
                                                            {participante.nombre} {participante.apellido}
                                                        </h5>
                                                        <p className="text-sm text-gray-600">DNI: {participante.dni}</p>
                                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                                            <HiOutlinePhone className="w-4 h-4" />
                                                            {participante.telefono}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${participante.distancia === '10k' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                            <DistanciaIcon className="w-4 h-4" />
                                                            {participante.distancia?.toUpperCase()} {participante.distancia === '10k' ? 'Competitiva' : 'Recreativa'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Detalles adicionales */}
                                                <div className="border-t pt-3 space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 flex items-center gap-1">
                                                            <FaTshirt className="w-4 h-4" />
                                                            Talle:
                                                        </span>
                                                        <span className="font-medium">{participante.talle_remera}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Categoría:</span>
                                                        <span className="font-medium">{participante.categoria_edad}</span>
                                                    </div>
                                                    {participante.team_agrupacion && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Team:</span>
                                                            <span className="font-medium">{participante.team_agrupacion}</span>
                                                        </div>
                                                    )}
                                                    {participante.qr_code && (
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-600 flex items-center gap-1">
                                                                <HiOutlineQrcode className="w-4 h-4" />
                                                                QR:
                                                            </span>
                                                            <span className="font-mono text-xs">{participante.qr_code}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Botón de imprimir */}
                                                {participante.qr_code && inscripcion.status === 'confirmed' && (
                                                    <div className="mt-4">
                                                        <button
                                                            onClick={() => handleReprintWithDebounce(participante.qr_code)}
                                                            disabled={isPrinting}
                                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <HiOutlinePrinter />
                                                            {isPrinting ? 'Generando...' : 'Descargar Entrada'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Información importante */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h5 className="font-medium text-blue-900 mb-2">Información importante:</h5>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Fecha: 7 de Septiembre 2025</li>
                                        <li>• Lugar: San Francisco del Monte de Oro</li>
                                        <li>• Largada 10K: 07:30hs - 5K: 08:00hs</li>
                                        <li>• Presentar DNI y entrada el día del evento</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FaRunning className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No tienes inscripciones</h3>
                    <p className="mt-1 text-gray-500">
                        Cuando te inscribas al 10K del Maestro, aparecerán aquí.
                    </p>
                    <div className="mt-6">
                        <a
                            href="/"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <FaRunning className="mr-2 h-4 w-4" />
                            Inscribirme ahora
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisInscripciones;