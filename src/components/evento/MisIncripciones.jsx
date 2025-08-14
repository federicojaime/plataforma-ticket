import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { HiOutlineTicket, HiOutlineInformationCircle, HiOutlinePrinter, HiOutlineCalendar, HiOutlineQrcode } from "react-icons/hi";
import { toast } from 'react-toastify';

const MisTickets = () => {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchTickets();
    }, [user]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/evento/mis-tickets`, {
                headers: {
                    'Authorization': user.jwt
                }
            });
            const data = await response.json();
            if (data.ok) {
                setTickets(data.data || []);
            } else {
                setError(data.msg);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al cargar los tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleReprint = async (qrCode) => {
        let toastId = null;
        try {
            setIsPrinting(true);
            toastId = toast.loading('Generando ticket...');
            
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/evento/reimprimir-ticket/${qrCode}`, {
                headers: {
                    'Authorization': user.jwt
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Error al generar el ticket');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ticket-${qrCode}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.dismiss(toastId);
            toast.success('Ticket generado exitosamente');
        } catch (error) {
            console.error('Error:', error);
            if (toastId) {
                toast.dismiss(toastId);
            }
            toast.error(error.message || 'Error al generar el ticket');
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

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="animate-pulse space-y-6">
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
                    <HiOutlineTicket size={24} className="text-blue-600" />
                    <span>Mis Tickets</span>
                </h2>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {tickets.length > 0 ? (
                <div className="space-y-6">
                    {tickets.map((order) => (
                        <div key={order.order_id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-4 border-b">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Orden #{order.external_reference?.substr(0, 8)}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                            <HiOutlineCalendar className="text-gray-500" />
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-blue-600">
                                            {formatAmount(order.total_amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {order.individual_tickets.map((ticket, index) => (
                                        <div key={index} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="flex items-center gap-2 text-gray-700">
                                                    <HiOutlineTicket className="text-blue-500" />
                                                    Día {ticket.day}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                                                <HiOutlineQrcode className="text-gray-500" />
                                                <span className="font-mono">{ticket.qr_code}</span>
                                            </div>
                                            <button
                                                onClick={() => handleReprintWithDebounce(ticket.qr_code)}
                                                disabled={isPrinting}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <HiOutlinePrinter />
                                                {isPrinting ? 'Generando...' : 'Reimprimir Ticket'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <HiOutlineInformationCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No tienes tickets</h3>
                    <p className="mt-1 text-gray-500">
                        Cuando compres tickets para el evento, aparecerán aquí.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MisTickets;