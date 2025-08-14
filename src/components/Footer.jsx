// src/components/Footer.jsx - Optimizado para Móvil
import LogoMuni from '../assets/img/logo_blanco.png';
import LogoFas from "../assets/img/fas.png";
import LogoConfederacion from "../assets/img/confederacion.png";
import LogoCodeo from "../assets/img/codeo.png";
import LogoProvincia from "../assets/img/provincia.png";
import LogoVivi from "../assets/img/vivi.png";

const Footer = () => {
    return (
        <footer className="bg-[#00263b] text-gray-300 py-4 sm:py-6 mt-auto">
            <div className="container mx-auto px-4">
                {/* Versión móvil - Stack vertical */}
                <div className="flex flex-col items-center space-y-4 sm:hidden">
                    {/* Logos principales */}
                    <div className="flex flex-wrap justify-center items-center gap-3">
                        <img src={LogoMuni} alt="Logo Muni" className="w-auto h-8 sm:h-10" />
                        <img src={LogoVivi} alt="Logo Vivi" className="w-auto h-10 sm:h-12" />
                    </div>
                    
                    {/* Texto y logo de Codeo a la derecha */}
                    <a 
                        href="https://www.instagram.com/codeo.ar" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-2 hover:text-white transition-colors"
                    >
                        <p className="text-sm">Realizado por Codeo.ar</p>
                        <img src={LogoCodeo} alt="Logo Codeo" className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;