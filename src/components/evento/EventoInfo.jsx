import React from 'react';
import {
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineUsers,
    HiOutlineGift,
    HiOutlineDocumentText,
    HiOutlinePhone,
    HiOutlineMail
} from 'react-icons/hi';
import { FaRunning, FaTrophy, FaRoute, FaMedal } from 'react-icons/fa';
import Logo10K from "../../assets/img/10k.png";
import RunnerBanner from "../../assets/img/runner-banner.jpg";

const EventoInfo = () => {
    const horarios = [
        { hora: "06:00", actividad: "Apertura del evento y acreditaciones" },
        { hora: "07:00", actividad: "Calentamiento grupal" },
        { hora: "07:30", actividad: "Largada 10K Competitiva" },
        { hora: "08:00", actividad: "Largada 5K Recreativa" },
        { hora: "09:30", actividad: "Premiación y sorteos" },
        { hora: "10:30", actividad: "Cierre del evento" }
    ];

    const premios = [
        { categoria: "10K Masculino", premios: "1°, 2° y 3° puesto general" },
        { categoria: "10K Femenino", premios: "1°, 2° y 3° puesto general" },
        { categoria: "Por categorías", premios: "1° puesto en cada categoría de edad" },
        { categoria: "5K Participación", premios: "Medalla para todos los finishers" }
    ];

    const incluye = [
        "Remera técnica oficial del evento",
        "Chip de cronometraje profesional",
        "Medalla de finisher",
        "Kit del corredor con sorpresas",
        "Hidratación durante el recorrido",
        "Asistencia médica en el circuito"
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[50vh] overflow-hidden">
                <img
                    src={RunnerBanner}
                    alt="10K del Maestro"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-3xl blur-2xl"></div>
                            <img
                                src={Logo10K}
                                alt="Logo 10K del Maestro"
                                className="relative h-52 mx-auto drop-shadow-2xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-medium text-blue-200">Todo lo que tenes que saber</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Info Principal */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <HiOutlineCalendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Fecha</h3>
                                <p className="text-gray-600">7 de Septiembre 2025</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <HiOutlineLocationMarker className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Lugar</h3>
                                <p className="text-gray-600">San Francisco del Monte de Oro</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <HiOutlineClock className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Hora</h3>
                                <p className="text-gray-600">Largada 07:30hs</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Distancias */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Distancias Disponibles</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                            <FaRunning className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-4xl font-black text-blue-700 mb-2">5K</h3>
                            <p className="text-lg font-semibold text-blue-600 mb-2">Recreativa</p>
                            <p className="text-gray-600 text-sm">Perfecta para principiantes y familias</p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
                            <FaTrophy className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                            <h3 className="text-4xl font-black text-purple-700 mb-2">10K</h3>
                            <p className="text-lg font-semibold text-purple-600 mb-2">Competitiva</p>
                            <p className="text-gray-600 text-sm">Con cronometraje oficial y premiación</p>
                        </div>
                    </div>
                </div>

                {/* Cronograma */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                        <HiOutlineClock className="w-8 h-8 text-orange-500 mr-3" />
                        Cronograma del Evento
                    </h2>
                    <div className="space-y-4">
                        {horarios.map((item, index) => (
                            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-20 text-center">
                                    <span className="text-xl font-bold text-blue-600">{item.hora}</span>
                                </div>
                                <div className="flex-1 ml-6">
                                    <p className="text-gray-800 font-medium">{item.actividad}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Premiación */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                        <FaTrophy className="w-8 h-8 text-yellow-500 mr-3" />
                        Premiación
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {premios.map((premio, index) => (
                            <div key={index} className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                                <h3 className="font-bold text-gray-900 mb-2">{premio.categoria}</h3>
                                <p className="text-gray-700">{premio.premios}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Qué incluye */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                        <HiOutlineGift className="w-8 h-8 text-green-500 mr-3" />
                        ¿Qué incluye tu inscripción?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {incluye.map((item, index) => (
                            <div key={index} className="flex items-center p-4 bg-green-50 rounded-xl border border-green-100">
                                <FaMedal className="w-6 h-6 text-green-600 mr-4 flex-shrink-0" />
                                <span className="text-gray-800">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reglamento */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                        <HiOutlineDocumentText className="w-8 h-8 text-red-500 mr-3" />
                        Información Importante
                    </h2>
                    <div className="space-y-4 text-gray-700">
                        <p>• Es obligatorio presentar certificado médico apto para la práctica deportiva.</p>
                        <p>• La inscripción incluye seguro de accidentes personales durante el evento.</p>
                        <p>• El evento se realizará independientemente de las condiciones climáticas.</p>
                        <p>• Los menores de edad deben estar acompañados por un adulto responsable.</p>
                        <p>• Se requiere uso de calzado deportivo adecuado para running.</p>
                    </div>
                </div>

                {/* Contacto */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                    <h2 className="text-3xl font-bold mb-8 text-center">¿Necesitas más información?</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="text-center">
                            <HiOutlinePhone className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                            <h3 className="text-xl font-bold mb-2">Teléfono</h3>
                            <p className="text-blue-100">+54 9 266 123-4567</p>
                        </div>
                        <div className="text-center">
                            <HiOutlineMail className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                            <h3 className="text-xl font-bold mb-2">Email</h3>
                            <p className="text-blue-100">info@10kdelmaestro.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventoInfo;