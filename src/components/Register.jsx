import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Alert, Button, Card, Spinner, TextInput, Label } from 'flowbite-react';
import {
    HiOutlineInformationCircle,
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlineLocationMarker,
    HiOutlineCalendar,
    HiOutlineTicket,
    HiOutlineExclamation,
} from 'react-icons/hi';
import { FaTrophy } from 'react-icons/fa';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import Logo10K from '../assets/img/10k.png';
import RunnerBanner from '../assets/img/runner-banner.jpg';
import useForm from './utils';
import Footer from './Footer';

/* ===== Config ===== */
const MAINTENANCE_MODE = false;
const MAINTENANCE_CONFIG = {
    title: 'Sitio en Mantenimiento',
    message: 'Estamos realizando mejoras en nuestro sistema. Volveremos pronto.',
    estimatedTime: '30 minutos',
    contactEmail: 'soporte@10kdelmaestro.com',
};

/* ===== Utils (in-app browsers) ===== */
const isInAppBrowser = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /FBAN|FBAV|Instagram|Line|Messenger|LinkedIn|Twitter|WhatsApp/i.test(userAgent);
};

const openInExternalBrowser = () => {
    const currentUrl = window.location.href;
    const tryRedirect = () => {
        if (/android/i.test(navigator.userAgent)) {
            window.location.href = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=com.android.chrome;end`;
            setTimeout(() => {
                window.location.href = `market://details?id=com.android.chrome`;
            }, 2000);
        } else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            window.location.href = currentUrl;
            setTimeout(() => {
                window.location.replace(currentUrl);
            }, 2000);
        } else {
            window.open(currentUrl, '_system');
        }
    };
    alert('Para una mejor experiencia, la aplicación se abrirá en tu navegador predeterminado.');
    tryRedirect();
};

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [dataUser, cambiarValores] = useForm({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (dataUser.password !== dataUser.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        const userDataToSend = {
            firstname: dataUser.firstname,
            lastname: dataUser.lastname,
            email: dataUser.email,
            password: dataUser.password
        };

        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            const response = await fetch(`${apiUrl}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDataToSend),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/registro-exitoso');
            } else {
                setError(data.errores[0] || 'Error al registrar usuario. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Hubo un error de conexión. Por favor, intenta más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setError('');

        try {
            if (isInAppBrowser()) {
                setError('Por favor, usa tu navegador predeterminado para registrarte.');
                return;
            }

            // 1. Autenticación con Firebase
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            // 2. Obtener el token ID de Firebase
            const idToken = await firebaseUser.getIdToken();

            if (!idToken) {
                throw new Error('No se pudo obtener el token de Firebase');
            }

            // 3. Autenticación con nuestro backend
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/user/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    email: firebaseUser.email,
                    firstname: firebaseUser.displayName?.split(' ')[0] || '',
                    lastname: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                    googleId: firebaseUser.uid,
                    firebaseToken: idToken
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errores[0] || 'Error en la respuesta del servidor');
            }

            if (data.ok && data.data?.jwt) {
                const userData = {
                    ...data.data,
                    googleId: firebaseUser.uid,
                    firebaseToken: idToken
                };
                login(userData);
                navigate('/', { replace: true });
            } else {
                throw new Error(data.errores[0] || 'Error en la autenticación con Google');
            }
        } catch (error) {
            console.error('Error detallado:', error);

            if (error.code === 'auth/popup-closed-by-user') {
                setError('El proceso de registro fue cancelado');
            } else if (error.code === 'auth/network-request-failed') {
                setError('Error de conexión. Por favor, verifica tu conexión a internet');
            } else {
                setError('Error al registrar con Google: ' + (error.message || 'Error desconocido'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    /* ===== UI ===== */
    const features = [
        { icon: HiOutlineTicket, text: 'Inscripción online', color: 'text-blue-400' },
        { icon: FaTrophy, text: 'Premios y medallas', color: 'text-yellow-400' },
        {
            icon: HiOutlineLocationMarker,
            text: (
                <>
                    San Francisco
                    <br />
                    del Monte de Oro
                </>
            ),
            color: 'text-emerald-400'
        },
    ];

    const MaintenanceScreen = () => (
        <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto">
                <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-none w-full">
                    <div className="text-center space-y-6">
                        <div className="flex justify-center mb-6">
                            <img
                                src={Logo10K}
                                alt="Logo 10K del Maestro"
                                className="h-32 md:h-40 lg:h-48 xl:h-52 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300 filter brightness-110"
                            />
                        </div>
                        <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-2xl bg-orange-100">
                            <HiOutlineExclamation className="w-12 h-12 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">{MAINTENANCE_CONFIG.title}</h2>
                            <p className="text-lg text-gray-600 mb-2">{MAINTENANCE_CONFIG.message}</p>
                            <p className="text-sm text-gray-500">
                                Est. {MAINTENANCE_CONFIG.estimatedTime} — {MAINTENANCE_CONFIG.contactEmail}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    return (
        <main className="flex-1">
            <div className="min-h-screen w-full relative bg-slate-950 selection:bg-indigo-500/30 selection:text-white flex flex-col">
                {/* Fondo: imagen + gradiente */}
                <div className="absolute inset-0 z-0">
                    <img src={RunnerBanner} alt="Running Background" className="w-full h-full object-cover" loading="eager" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-900/70 to-indigo-700/40" />
                    <div className="absolute inset-0 backdrop-blur-[1px]" />
                </div>

                {MAINTENANCE_MODE ? (
                    <MaintenanceScreen />
                ) : (
                    <div className="relative z-10 flex-1 flex flex-col">
                        {/* Contenido principal */}
                        <div className="flex-1 flex items-center justify-center px-4 py-8">
                            <div className="max-w-7xl w-full mx-auto">
                                {/* MISMA ALTURA Y CENTRADOS */}
                                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                                    {/* IZQUIERDA */}
                                    <section className="text-white h-full">
                                        {/* Contenedor igual al formulario */}
                                        <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/25 shadow-2xl min-h-[720px] h-full flex flex-col">
                                            {/* Logo grande y centrado */}
                                            <div className="flex items-center justify-center mb-6">
                                                <img
                                                    src={Logo10K}
                                                    alt="Logo 10K del Maestro"
                                                    className="h-32 md:h-40 lg:h-48 xl:h-52 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300 filter brightness-110"
                                                />
                                            </div>

                                            {/* Info evento */}
                                            <div className="space-y-5 flex-1 flex flex-col justify-start">
                                                {/* Ubicación / Fecha */}
                                                <div className="text-center space-y-4">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1"></div>
                                                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                                        <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1"></div>
                                                    </div>

                                                    <div className="flex items-center justify-center gap-3">
                                                        <HiOutlineCalendar className="w-6 h-6 text-blue-300" />
                                                        <span className="text-lg md:text-xl font-semibold text-blue-100">7 de Septiembre 2025</span>
                                                    </div>
                                                </div>

                                                {/* Distancias */}
                                                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/15">
                                                    <h3 className="text-lg font-bold mb-4 text-center">Distancias Disponibles</h3>
                                                    <div className="flex justify-center items-center gap-8">
                                                        <div className="text-center group">
                                                            <div className="text-2xl font-black text-sky-300 drop-shadow-lg group-hover:scale-110 transition-transform">5K</div>
                                                            <div className="text-sm text-blue-200 font-medium">Recreativa</div>
                                                        </div>
                                                        <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                                                        <div className="text-center group">
                                                            <div className="text-3xl font-black text-yellow-300 drop-shadow-lg group-hover:scale-110 transition-transform">10K</div>
                                                            <div className="text-sm text-blue-200 font-medium">Competitiva</div>
                                                        </div>
                                                    </div>
                                                    <p className="text-center text-xs text-blue-200/80 mt-3">Incluye remera técnica, chip de cronometraje y kit del atleta</p>
                                                </div>
                                            </div>

                                            {/* Features */}
                                            <div className="grid grid-cols-3 gap-3 mt-6">
                                                {features.map((f, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-3 border border-white/15 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group text-center"
                                                    >
                                                        <f.icon className={`w-5 h-5 ${f.color} mb-2 drop-shadow group-hover:scale-110 transition-transform mx-auto`} />
                                                        <p className="text-xs font-semibold text-white leading-tight">{f.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    {/* DERECHA */}
                                    <aside className="w-full h-full">
                                        <Card className="backdrop-blur-2xl bg-white/95 shadow-[0_20px_70px_rgba(0,0,0,0.3)] border border-white/60 w-full rounded-3xl min-h-[720px] h-full flex">
                                            <div className="p-6 flex flex-col justify-between w-full">
                                                <div className="space-y-5">
                                                    <h2 className="text-2xl md:text-3xl font-black text-center bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                                                        ¡Creá tu cuenta!
                                                    </h2>

                                                    {error && (
                                                        <Alert color="failure" icon={HiOutlineInformationCircle}>
                                                            {error}
                                                        </Alert>
                                                    )}

                                                    <form className="space-y-4" onSubmit={handleSubmit}>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label htmlFor="firstname" value="Nombre" />
                                                                </div>
                                                                <TextInput
                                                                    id="firstname"
                                                                    name="firstname"
                                                                    icon={HiOutlineUser}
                                                                    value={dataUser.firstname}
                                                                    onChange={cambiarValores}
                                                                    placeholder="Tu nombre"
                                                                    required
                                                                    className="focus:ring-2 focus:ring-sky-400"
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label htmlFor="lastname" value="Apellido" />
                                                                </div>
                                                                <TextInput
                                                                    id="lastname"
                                                                    name="lastname"
                                                                    icon={HiOutlineUser}
                                                                    value={dataUser.lastname}
                                                                    onChange={cambiarValores}
                                                                    placeholder="Tu apellido"
                                                                    required
                                                                    className="focus:ring-2 focus:ring-sky-400"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="mb-2 block">
                                                                <Label htmlFor="email" value="Correo Electrónico" />
                                                            </div>
                                                            <TextInput
                                                                id="email"
                                                                type="email"
                                                                name="email"
                                                                icon={HiOutlineMail}
                                                                value={dataUser.email}
                                                                onChange={cambiarValores}
                                                                placeholder="tu@email.com"
                                                                required
                                                                className="focus:ring-2 focus:ring-sky-400"
                                                            />
                                                        </div>

                                                        <div>
                                                            <div className="mb-2 block">
                                                                <Label htmlFor="password" value="Contraseña" />
                                                            </div>
                                                            <TextInput
                                                                id="password"
                                                                type="password"
                                                                name="password"
                                                                icon={HiOutlineLockClosed}
                                                                value={dataUser.password}
                                                                onChange={cambiarValores}
                                                                placeholder="••••••••"
                                                                required
                                                                className="focus:ring-2 focus:ring-sky-400"
                                                            />
                                                        </div>

                                                        <div>
                                                            <div className="mb-2 block">
                                                                <Label htmlFor="confirmPassword" value="Confirmar Contraseña" />
                                                            </div>
                                                            <TextInput
                                                                id="confirmPassword"
                                                                type="password"
                                                                name="confirmPassword"
                                                                icon={HiOutlineLockClosed}
                                                                value={dataUser.confirmPassword}
                                                                onChange={cambiarValores}
                                                                placeholder="••••••••"
                                                                required
                                                                className="focus:ring-2 focus:ring-sky-400"
                                                            />
                                                        </div>

                                                        <Button
                                                            type="submit"
                                                            className="w-full bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-sky-300"
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? (
                                                                <>
                                                                    <Spinner size="sm" light={true} />
                                                                    <span className="ml-2">Registrando...</span>
                                                                </>
                                                            ) : (
                                                                'REGISTRARSE'
                                                            )}
                                                        </Button>
                                                    </form>

                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <div className="w-full border-t border-gray-300"></div>
                                                        </div>
                                                        <div className="relative flex justify-center text-sm">
                                                            <span className="px-3 bg-white text-gray-500 rounded-lg font-medium">O continuá con</span>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        color="light"
                                                        className="w-full hover:bg-white/80 transition-colors border-2 border-gray-200 hover:border-gray-300"
                                                        onClick={handleGoogleRegister}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Spinner size="sm" />
                                                                <span className="ml-2">Registrando con Google...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <img
                                                                    className="h-5 w-5 mr-3"
                                                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                                                    alt="Google Logo"
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                />
                                                                Continuar con Google
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>

                                                <p className="text-center text-sm text-gray-600 mt-6">
                                                    ¿Ya tenés cuenta?{' '}
                                                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                                                        Iniciá sesión aquí
                                                    </Link>
                                                </p>
                                            </div>
                                        </Card>
                                    </aside>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10">
                            <Footer />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Register;