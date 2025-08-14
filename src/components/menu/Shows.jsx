import React from 'react';
import { Calendar, Music, Users } from 'lucide-react';

const artistasData = [
    {
        dia: "Jueves 2 de Enero",
        color: "#f9b603",
        artistas: [
            {
                nombre: "Euge Quevedo y la LBC",
                tipo: "Cuarteto"
            },
            {
                nombre: "Los Pasioneros",
                tipo: "Cuarteto"
            },
            {
                nombre: "Simplemente Los Cantores del Alba",
                tipo: "Folclore Tradicional"
            },

            {
                nombre: "Trío Chamamecero",
                tipo: "Chamamé"
            },
            {
                nombre: "Emanuel Mansilla",
                tipo: "Folclore"
            }
        ]
    },
    {
        dia: "Viernes 3 de Enero",
        color: "#17b1be",
        artistas: [
            {
                nombre: "Chipote",
                tipo: "Cuarteto"
            },
            {
                nombre: "Ceibo",
                tipo: "Folclore"
            },
            {
                nombre: "Los Sanfra",
                tipo: "Folclore"
            },
            {
                nombre: "Waqay",
                tipo: "Folclore"
            },
            {
                nombre: "Juan Manuel \"El Ángel Tropical\"",
                tipo: "Tropical"
            }
        ]
    }
];

const GrillaArtistas = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-4">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Programación del Festival</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Grilla de Artistas
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {artistasData.map((dia, index) => (
                        <div key={index} className="relative">
                            <div
                                className="absolute inset-0 bg-gradient-to-br rounded-3xl opacity-5"
                                style={{ backgroundColor: dia.color }}
                            />
                            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                                <div
                                    className="h-2"
                                    style={{ backgroundColor: dia.color }}
                                />
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                            style={{ backgroundColor: `${dia.color}15` }}
                                        >
                                            <Calendar
                                                className="w-6 h-6"
                                                style={{ color: dia.color }}
                                            />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {dia.dia}
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        {dia.artistas.map((artista, idx) => (
                                            <div
                                                key={idx}
                                                className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-gray-50"
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                                    style={{ backgroundColor: `${dia.color}15` }}
                                                >
                                                    <Music
                                                        className="w-5 h-5"
                                                        style={{ color: dia.color }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 mb-1">
                                                        {artista.nombre}
                                                    </h4>
                                                    <span
                                                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                                                        style={{
                                                            backgroundColor: `${dia.color}15`,
                                                            color: dia.color
                                                        }}
                                                    >
                                                        <Users className="w-3 h-3" />
                                                        {artista.tipo}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GrillaArtistas;