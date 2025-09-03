import React from 'react';
import {
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineUsers,
    HiOutlineGift,
    HiOutlineDocumentText,
    HiOutlinePhone,
    HiOutlineMail,
    HiOutlineHeart
} from 'react-icons/hi';
import { FaRunning, FaTrophy, FaRoute, FaMedal, FaChild, FaWheelchair } from 'react-icons/fa';
import Logo10K from "../../assets/img/10k.png";
import RunnerBanner from "../../assets/img/runner-banner.jpg";

const EventoInfo = () => {
    const horarios = [
        { hora: "06:00", actividad: "Apertura del evento y acreditaciones" },
        { hora: "07:00", actividad: "Calentamiento grupal" },
        { hora: "07:30", actividad: "Largada 10K" },
        { hora: "08:00", actividad: "Largada 5K" },
        { hora: "08:30", actividad: "Largada Kids y Categoría adaptado" },
        { hora: "09:30", actividad: "Premiación y sorteos" },
        { hora: "10:30", actividad: "Cierre del evento" }
    ];

    const premios = [
        { categoria: "10K Masculino", premios: "1° a 5° puesto general" },
        { categoria: "10K Femenino", premios: "1° a 5° puesto general" },
        { categoria: "Por categorías", premios: "1° puesto en cada categoría de edad" },
        { categoria: "5K Categoría", premios: "Medalla para todos los finishers" },
        { categoria: "Kids", premios: "Sorpresas para todos los participantes" },
        { categoria: "Categoría adaptado", premios: "Medalla de reconocimiento especial" }
    ];

    const incluye = [
        "Remera técnica oficial del evento",
        "Chip de cronometraje profesional (5K y 10K)",
        "Medalla de finisher",
        "Kit del corredor con sorpresas",
        "Hidratación durante el recorrido",
        "Asistencia médica en el circuito",
        "Kit especial para categoría Kids",
        "Asistencia especializada para categoría adaptado"
    ];

    const categorias = [
        {
            name: "5K Categoría",
            description: "Perfecta para principiantes y familias",
            icon: FaRunning,
            color: "blue",
            price: "Paga",
            details: "Distancia ideal para quienes se inician en el running"
        },
        {
            name: "10K Categoría",
            description: "Con cronometraje oficial y premiación",
            icon: FaTrophy,
            color: "purple",
            price: "Paga",
            details: "Competencia oficial con premios por categorías"
        },
        {
            name: "Categoría Kids",
            description: "Para menores de 15 años",
            icon: FaChild,
            color: "green",
            price: "GRATUITA",
            details: "Distancia especial adaptada para los más pequeños"
        },
        {
            name: "Categoría adaptado",
            description: "Para personas con discapacidad",
            icon: FaWheelchair,
            color: "orange",
            price: "GRATUITA",
            details: "Con asistencia especializada y recorrido adaptado"
        }
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
                                <p className="text-gray-600">Largada desde las 07:30hs</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categorías Actualizadas */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Categorías</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categorias.map((categoria, index) => {
                            const IconComponent = categoria.icon;
                            const isGratuita = categoria.price === "GRATUITA";

                            return (
                                <div key={index} className={`text-center p-6 rounded-2xl border relative overflow-hidden transition-transform hover:scale-105 ${categoria.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100' :
                                    categoria.color === 'purple' ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100' :
                                        categoria.color === 'green' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100' :
                                            'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100'
                                    }`}>
                                    {isGratuita && (
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <HiOutlineHeart className="w-3 h-3" />
                                                GRATIS
                                            </span>
                                        </div>
                                    )}
                                    <IconComponent className={`w-12 h-12 mx-auto mb-4 ${categoria.color === 'blue' ? 'text-blue-600' :
                                        categoria.color === 'purple' ? 'text-purple-600' :
                                            categoria.color === 'green' ? 'text-green-600' :
                                                'text-orange-600'
                                        }`} />
                                    <h3 className={`text-xl font-black mb-2 ${categoria.color === 'blue' ? 'text-blue-700' :
                                        categoria.color === 'purple' ? 'text-purple-700' :
                                            categoria.color === 'green' ? 'text-green-700' :
                                                'text-orange-700'
                                        }`}>
                                        {categoria.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2">{categoria.description}</p>
                                    <p className="text-xs text-gray-500">{categoria.details}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Nota especial sobre categorías gratuitas */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-100">
                        <div className="flex items-center justify-center mb-4">
                            <HiOutlineHeart className="w-8 h-8 text-green-600 mr-3" />
                            <h3 className="text-xl font-bold text-green-800">Categorías Gratuitas</h3>
                        </div>
                        <div className="text-center text-green-700">
                            <p className="mb-2">Las categorías <strong>Kids</strong> y <strong>Inclusiva</strong> son completamente gratuitas.</p>
                            <p className="text-sm">Solo incluyen la participación en el evento, sin remera ni kit adicional.</p>
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

                {/* Qué incluye cada categoría */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                        <HiOutlineGift className="w-8 h-8 text-green-500 mr-3" />
                        ¿Qué incluye cada categoría?
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Categorías pagas */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-blue-600 mb-4">Categorías 5K y 10K (Pagas)</h3>
                            <div className="space-y-3">
                                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <FaMedal className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                                    <span className="text-gray-800">Remera técnica oficial del evento</span>
                                </div>
                                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <FaMedal className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                                    <span className="text-gray-800">Chip de cronometraje profesional</span>
                                </div>
                                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <FaMedal className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                                    <span className="text-gray-800">Medalla de finisher</span>
                                </div>
                                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <FaMedal className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                                    <span className="text-gray-800">Kit del corredor con sorpresas</span>
                                </div>
                                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <FaMedal className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                                    <span className="text-gray-800">Hidratación durante el recorrido</span>
                                </div>
                                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <FaMedal className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                                    <span className="text-gray-800">Asistencia médica en el circuito</span>
                                </div>
                            </div>
                        </div>

                        {/* Categorías gratuitas */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center">
                                <HiOutlineHeart className="w-6 h-6 mr-2" />
                                Categorías Kids e Inclusiva (Gratuitas)
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-100">
                                    <FaChild className="w-6 h-6 text-green-600 mr-4 flex-shrink-0" />
                                    <span className="text-gray-800">Solo participación en el evento</span>
                                </div>
                                <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-100">
                                    <FaWheelchair className="w-6 h-6 text-green-600 mr-4 flex-shrink-0" />
                                    <span className="text-gray-800">Asistencia especializada (categoría adaptado)</span>
                                </div>
                                <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-100">
                                    <HiOutlineHeart className="w-6 h-6 text-green-600 mr-4 flex-shrink-0" />
                                    <span className="text-gray-800">Acceso completo al evento</span>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <p className="text-amber-800 text-sm">
                                        <strong>Nota:</strong> No incluye remera técnica, kit del corredor ni otros elementos físicos.
                                    </p>
                                </div>
                            </div>
                        </div>
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
                        <p>• Para la categoría adaptado se requiere certificado de discapacidad.</p>
                        <p>• La categoría Kids es para menores de 15 años únicamente.</p>
                        <p>• La inscripción incluye seguro de accidentes personales durante el evento.</p>
                        <p>• El evento se realizará independientemente de las condiciones climáticas.</p>
                        <p>• Los menores de edad deben estar acompañados por un adulto responsable.</p>
                        <p>• Se requiere uso de calzado deportivo adecuado para running.</p>
                        <p>• Las categorías gratuitas solo incluyen participación, sin elementos adicionales.</p>
                    </div>
                </div>

                {/* Contacto */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                    <h2 className="text-3xl font-bold mb-8 text-center">¿Necesitas más información?</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="text-center">
                            <a
                                href="https://wa.me/5492664776313"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <HiOutlinePhone className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                                <h3 className="text-xl font-bold mb-2">Teléfono</h3>
                                <p className="text-blue-100">+54 9 266 4776313</p></a>
                        </div>
                        <div className="text-center">
                            <HiOutlineMail className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                            <h3 className="text-xl font-bold mb-2">Email</h3>
                            <p className="text-blue-100">evento@vivisanfrancisco.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventoInfo;