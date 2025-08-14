import { Sidebar, Navbar } from "flowbite-react";
import { useState } from "react";
import {
    HiOutlineTicket,
    HiOutlineSearch,
    HiOutlineUser,
    HiOutlineDownload,
    HiOutlineMusicNote,
    HiOutlineShoppingBag,
    HiOutlineUserGroup
} from "react-icons/hi";
import Logo from "../../assets/img/logonegro.png";
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
            text: "Comprar Entradas",
            path: "/",
            color: "text-cyan-600"
        },
        {
            icon: HiOutlineMusicNote,
            text: "Ver Shows",
            path: "/shows",
            color: "text-amber-500"
        },
        {
            icon: HiOutlineUserGroup,
            text: "Mis Entradas",
            path: "/mis_entradas",
            color: "text-emerald-500"
        },
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
                    <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-[#4baccc]/20">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className="flex items-center py-4 px-6 text-[#00263b] hover:bg-gray-50 rounded-xl transition-all duration-300 mb-2"
                            >
                                <item.icon className={`w-6 h-6 mr-3 ${item.color}`} />
                                <span className="font-medium">{item.text}</span>
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full py-4 px-6 text-[#00263b] hover:bg-[#e7ac2a]/10 rounded-xl transition-all duration-300"
                        >
                            <HiOutlineUser className="w-6 h-6 mr-3 text-[#e7ac2a]" />
                            <span className="font-medium">Cerrar Sesión</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Layout Principal */}
            <div className="flex flex-1">
                {/* Sidebar Desktop */}
                <div className="hidden md:block w-80">
                    <div className="fixed h-full w-80 bg-white border-r border-[#4baccc]/20">
                        <div className="flex flex-col h-full">
                            <div className="p-8 border-b border-[#4baccc]/20">
                                <img src={Logo} alt="Logo" className="h-16" />
                                <h2 className="mt-6 text-xl font-bold text-[#00263b]">
                                    36° Festival Provincial del Artesano
                                </h2>
                                <p className="mt-2 text-gray-600">
                                    Celebrando nuestra cultura y tradición
                                </p>
                            </div>

                            <div className="flex-1 p-6 space-y-4">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className="flex items-center px-4 py-3 text-[#00263b] hover:bg-[#4baccc]/10 rounded-xl transition-all duration-300"
                                    >
                                        <item.icon className={`w-6 h-6 mr-3 ${item.color}`} />
                                        <span className="font-medium">{item.text}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className=" border-t border-[#4baccc]/20">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 text-[#00263b] hover:bg-[#e7ac2a]/10 rounded-xl transition-all duration-300"
                                >
                                    <HiOutlineUser className="w-6 h-6 mr-3 text-[#e7ac2a]" />
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