import { Sidebar, Navbar } from "flowbite-react";
import { useState } from "react";
import {
    HiOutlineTicket,
    HiOutlineUser,
    HiOutlineUserGroup,
    HiOutlineClipboardList
} from "react-icons/hi";
import { FaRunning, FaTrophy } from "react-icons/fa";
import Logo from "../../assets/img/10k.png";
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Footer from '../Footer';

const Home = () => {
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

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
        // {
        //     icon: FaTrophy,
        //     text: "Resultados",
        //     path: "/resultados",
        //     color: "text-yellow-500"
        // }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc]">
            {/* Navbar móvil */}
            <div className="md:hidden">
                <Navbar fluid={true} className="bg-white shadow-sm px-4 py-3">
                    <Navbar.Brand href="#" className="flex items-center space-x-3">
                        <img src={Logo} alt="Logo" className="h-14" />
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={() => setIsOpen(!isOpen)} />
                </Navbar>
                {isOpen && (
                    <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-blue-500/20">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className="flex items-center py-4 px-6 text-[#00263b] hover:bg-gray-50 rounded-xl transition-all duration-300 mb-2"
                                onClick={() => setIsOpen(false)}
                            >
                                <item.icon className={`w-6 h-6 mr-3 ${item.color}`} />
                                <span className="font-medium">{item.text}</span>
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full py-4 px-6 text-[#00263b] hover:bg-red-50 rounded-xl transition-all duration-300"
                        >
                            <HiOutlineUser className="w-6 h-6 mr-3 text-red-500" />
                            <span className="font-medium">Cerrar Sesión</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Layout Principal */}
            <div className="flex flex-1">
                {/* Sidebar Desktop */}
                <div className="hidden md:block w-80">
                    <div className="fixed h-full w-80 bg-white border-r border-blue-500/20">
                        <div className="flex flex-col h-full">
                            <div className="p-8 border-b border-blue-500/10">
                                {/* Logo Section */}
                                <div className="text-center mb-8">
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
                                        <img
                                            src={Logo}
                                            alt="Logo 10K del Maestro"
                                            className="relative h-32 w-auto mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Event Info */}
                                <div className="text-center space-y-4">
                                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white shadow-lg">
                                        <span className="text-lg font-bold">7 de Septiembre 2025</span>
                                    </div>

                                    <p className="text-gray-600 font-medium">
                                        San Francisco del Monte de Oro
                                    </p>

                                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-4 border border-blue-100 shadow-sm">
                                        <div className="flex items-center justify-center space-x-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-sky-600">5K</div>
                                            </div>
                                            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                                            <div className="text-center">
                                                <div className="text-3xl font-black text-blue-700">10K</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-6 space-y-4">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className="flex items-center px-4 py-3 text-[#00263b] hover:bg-blue-50 rounded-xl transition-all duration-300"
                                    >
                                        <item.icon className={`w-6 h-6 mr-3 ${item.color}`} />
                                        <span className="font-medium">{item.text}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="p-6 border-t border-blue-500/20">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 text-[#00263b] hover:bg-red-50 rounded-xl transition-all duration-300"
                                >
                                    <HiOutlineUser className="w-6 h-6 mr-3 text-red-500" />
                                    <span className="font-medium">Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido Principal y Footer */}
                <div className="flex-1 flex flex-col">
                    <main className="flex-1 p-6 md:p-10">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Home;