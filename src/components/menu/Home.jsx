// src/components/menu/Home.jsx - Optimizado para Móvil
import { Sidebar, Navbar } from "flowbite-react";
import { useState } from "react";
import {
    HiOutlineTicket,
    HiOutlineUser,
    HiOutlineUserGroup,
    HiOutlineClipboardList,
    HiOutlineMenu,
    HiOutlineX
} from "react-icons/hi";
import { FaRunning, FaTrophy } from "react-icons/fa";
import Logo from "../../assets/img/10k.png";
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Footer from '../Footer';

const Home = () => {
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("tikets-token");
        logout();
        navigate('/login');
    };

    const menuItems = [
        {
            icon: HiOutlineTicket,
            text: "Inscribirme",
            path: "/",
            color: "text-blue-600"
        },
        {
            icon: FaRunning,
            text: "Ver Evento",
            path: "/evento-info",
            color: "text-green-500"
        },
        {
            icon: HiOutlineClipboardList,
            text: "Mis Inscripciones",
            path: "/mis_entradas",
            color: "text-purple-500"
        },
    ];

    const isActivePath = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc]">
            {/* Navbar móvil mejorado */}
            <div className="md:hidden">
                <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                    <div className="flex items-center justify-between px-4 py-3">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <img src={Logo} alt="Logo" className="h-10 sm:h-12" />
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold text-gray-800">10K del Maestro</h1>
                                <p className="text-xs text-gray-500">7 de Septiembre 2025</p>
                            </div>
                        </div>

                        {/* Menú hamburguesa */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
                        >
                            {isOpen ? (
                                <HiOutlineX className="w-6 h-6 text-gray-600" />
                            ) : (
                                <HiOutlineMenu className="w-6 h-6 text-gray-600" />
                            )}
                        </button>
                    </div>

                    {/* Menú desplegable móvil */}
                    {isOpen && (
                        <div className="bg-white border-t border-gray-100 shadow-lg">
                            <div className="px-2 py-3 space-y-1">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 touch-manipulation ${
                                            isActivePath(item.path)
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <item.icon className={`w-5 h-5 mr-3 ${
                                            isActivePath(item.path) ? 'text-blue-600' : item.color
                                        }`} />
                                        <span className="font-medium">{item.text}</span>
                                    </Link>
                                ))}
                                
                                <div className="border-t border-gray-100 pt-2 mt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 touch-manipulation"
                                    >
                                        <HiOutlineUser className="w-5 h-5 mr-3" />
                                        <span className="font-medium">Cerrar Sesión</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Layout Principal */}
            <div className="flex flex-1">
                {/* Sidebar Desktop */}
                <div className="hidden md:block w-72 lg:w-80">
                    <div className="fixed h-full w-72 lg:w-80 bg-white border-r border-blue-500/20 overflow-y-auto">
                        <div className="flex flex-col h-full">
                            <div className="p-6 lg:p-8 border-b border-blue-500/10">
                                {/* Logo Section */}
                                <div className="text-center mb-6 lg:mb-8">
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
                                        <img
                                            src={Logo}
                                            alt="Logo 10K del Maestro"
                                            className="relative h-24 lg:h-32 w-auto mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Event Info */}
                                <div className="text-center space-y-3 lg:space-y-4">
                                    <div className="inline-flex items-center px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white shadow-lg">
                                        <span className="text-base lg:text-lg font-bold">7 de Septiembre 2025</span>
                                    </div>

                                    <p className="text-gray-600 font-medium text-sm lg:text-base">
                                        San Francisco del Monte de Oro
                                    </p>

                                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-blue-100 shadow-sm">
                                        <div className="flex items-center justify-center space-x-3 lg:space-x-4">
                                            <div className="text-center">
                                                <div className="text-xl lg:text-2xl font-black text-sky-600">5K</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wide">Recreativa</div>
                                            </div>
                                            <div className="w-px h-6 lg:h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                                            <div className="text-center">
                                                <div className="text-2xl lg:text-3xl font-black text-blue-700">10K</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wide">Competitiva</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-4 lg:p-6 space-y-2 lg:space-y-4">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className={`flex items-center px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-300 ${
                                            isActivePath(item.path)
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                                : 'text-[#00263b] hover:bg-blue-50'
                                        }`}
                                    >
                                        <item.icon className={`w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 ${
                                            isActivePath(item.path) ? 'text-blue-600' : item.color
                                        }`} />
                                        <span className="font-medium text-sm lg:text-base">{item.text}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="p-4 lg:p-6 border-t border-blue-500/20">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-3 lg:px-4 py-2 lg:py-3 text-red-600 hover:bg-red-50 rounded-lg lg:rounded-xl transition-all duration-300"
                                >
                                    <HiOutlineUser className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" />
                                    <span className="font-medium text-sm lg:text-base">Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido Principal y Footer */}
                <div className="flex-1 flex flex-col md:ml-72 lg:ml-80">
                    <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>

            {/* Bottom Navigation para móvil (alternativa) */}
            <div className="md:hidden bg-white border-t border-gray-200 px-4 py-2">
                <div className="flex justify-around">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors touch-manipulation ${
                                isActivePath(item.path)
                                    ? 'text-blue-600'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">{item.text.split(' ')[0]}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;