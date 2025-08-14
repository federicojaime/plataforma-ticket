// src/components/Login.jsx - Versión Optimizada para Móvil
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

import { getAuth, GoogleAuthProvider, signInWithPopup, getRedirectResult } from 'firebase/auth';
import { app } from '../config/firebase';
import Logo10K from '../assets/img/10k.png';
import RunnerBanner from '../assets/img/runner-banner.jpg';
import { useAuth } from '../context/AuthContext';
import Loading from './ui/Loading';
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

/* ===== Component ===== */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { user, login, authLoading } = useAuth();

    useEffect(() => {
        if (isInAppBrowser()) openInExternalBrowser();
    }, []);
    useEffect(() => {
        if (!authLoading && user) navigate('/', { replace: true });
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (!result) return;

                const firebaseUser = result.user;
                const idToken = await firebaseUser.getIdToken();
                if (!idToken) throw new Error('No se pudo obtener el token de Firebase');

                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/user/google-login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        email: firebaseUser.email,
                        firstname: firebaseUser.displayName?.split(' ')[0] || '',
                        lastname: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                        googleId: firebaseUser.uid,
                        firebaseToken: idToken,
                    }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Error en la respuesta del servidor');

                if (data.ok && data.data?.jwt) {
                    const userData = { ...data.data, googleId: firebaseUser.uid, firebaseToken: idToken };
                    login(userData);
                    navigate('/', { replace: true });
                } else {
                    throw new Error(data.msg || 'Error en la autenticación con Google');
                }
            } catch (error) {
                console.error('Error en redirección:', error);
                setError('Error en la autenticación. Por favor, intenta nuevamente.');
            }
        };
        handleRedirectResult();
    }, [auth, login, navigate]);

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setIsLoading(true);
            if (isInAppBrowser()) {
                setError('Por favor, usa tu navegador predeterminado para iniciar sesión.');
                return;
            }

            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            const idToken = await firebaseUser.getIdToken();
            if (!idToken) throw new Error('No se pudo obtener el token de Firebase');

            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/user/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    email: firebaseUser.email,
                    firstname: firebaseUser.displayName?.split(' ')[0] || '',
                    lastname: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                    googleId: firebaseUser.uid,
                    firebaseToken: idToken,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error en la respuesta del servidor');

            if (data.ok && data.data?.jwt) {
                const userData = { ...data.data, googleId: firebaseUser.uid, firebaseToken: idToken };
                login(userData);
                navigate('/', { replace: true });
            } else {
                throw new Error(data.msg || 'Error en la autenticación con Google');
            }
        } catch (error) {
            console.error('Error en inicio de sesión con Google:', error);
            setError('Error al iniciar sesión con Google. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setError('');
        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error en el inicio de sesión');
            if (data.ok && data.data?.jwt) {
                login(data.data);
                navigate('/', { replace: true });
            } else {
                setError(data.msg || 'Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setError('Error en el inicio de sesión. Por favor, verifica tus credenciales.');
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) return <Loading />;

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
                                className="h-20 sm:h-24 md:h-32 lg:h-40 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300 filter brightness-110"
                            />                        
                        </div>
                        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center rounded-2xl bg-orange-100">
                            <HiOutlineExclamation className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">{MAINTENANCE_CONFIG.title}</h2>
                            <p className="text-base sm:text-lg text-gray-600 mb-2">{MAINTENANCE_CONFIG.message}</p>
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
                {/* Fondo: imagen + gradiente - Optimizado para móvil */}
                <div className="absolute inset-0 z-0">
                    <img src={RunnerBanner} alt="Running Background" className="w-full h-full object-cover object-center" loading="eager" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-900/70 to-indigo-700/40" />
                    <div className="absolute inset-0 backdrop-blur-[1px]" />
                </div>

                {MAINTENANCE_MODE ? (
                    <MaintenanceScreen />
                ) : (
                    <div className="relative z-10 flex-1 flex flex-col">
                        {/* Contenido principal - Stack vertical en móvil */}
                        <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
                            <div className="max-w-7xl w-full mx-auto">
                                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-stretch">
                                    {/* IZQUIERDA - Primero en móvil */}
                                    <section className="text-white h-full order-1 lg:order-1">
                                        <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-4 sm:p-6 border border-white/25 shadow-2xl min-h-[400px] lg:min-h-[620px] h-full flex flex-col">
                                            {/* Logo centrado - Reducido en móvil */}
                                            <div className="flex items-center justify-center mb-4 sm:mb-6">
                                                <img
                                                    src={Logo10K}
                                                    alt="Logo 10K del Maestro"
                                                    className="h-20 sm:h-24 md:h-32 lg:h-40 xl:h-52 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300 filter brightness-110"
                                                />
                                            </div>

                                            {/* Info evento */}
                                            <div className="space-y-4 sm:space-y-5 flex-1 flex flex-col justify-start">
                                                {/* Ubicación / Fecha */}
                                                <div className="text-center space-y-3 sm:space-y-4">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1"></div>
                                                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                                        <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1"></div>
                                                    </div>

                                                    <div className="flex items-center justify-center gap-3">
                                                        <HiOutlineCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
                                                        <span className="text-base sm:text-lg md:text-xl font-semibold text-blue-100">7 de Septiembre 2025</span>
                                                    </div>
                                                </div>

                                                {/* Distancias */}
                                                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-5 border border-white/15">
                                                    <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center">Distancias Disponibles</h3>
                                                    <div className="flex justify-center items-center gap-6 sm:gap-8">
                                                        <div className="text-center group">
                                                            <div className="text-xl sm:text-2xl font-black text-sky-300 drop-shadow-lg group-hover:scale-110 transition-transform">5K</div>
                                                            <div className="text-xs sm:text-sm text-blue-200 font-medium">Recreativa</div>
                                                        </div>
                                                        <div className="w-px h-8 sm:h-10 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                                                        <div className="text-center group">
                                                            <div className="text-2xl sm:text-3xl font-black text-yellow-300 drop-shadow-lg group-hover:scale-110 transition-transform">10K</div>
                                                            <div className="text-xs sm:text-sm text-blue-200 font-medium">Competitiva</div>
                                                        </div>
                                                    </div>
                                                    <p className="text-center text-xs text-blue-200/80 mt-3">Incluye remera técnica, chip de cronometraje y kit del atleta</p>
                                                </div>
                                            </div>

                                            {/* Features - Ajustado para móvil */}
                                            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
                                                {features.map((f, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-lg lg:rounded-xl p-2 sm:p-3 border border-white/15 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group text-center"
                                                    >
                                                        <f.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${f.color} mb-1 sm:mb-2 drop-shadow group-hover:scale-110 transition-transform mx-auto`} />
                                                        <p className="text-xs font-semibold text-white leading-tight">{f.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    {/* DERECHA - Card de login */}
                                    <aside className="w-full h-full order-2 lg:order-2">
                                        <Card className="backdrop-blur-2xl bg-white/95 shadow-[0_20px_70px_rgba(0,0,0,0.3)] border border-white/60 w-full rounded-2xl lg:rounded-3xl min-h-[500px] lg:min-h-[620px] h-full flex">
                                            <div className="p-4 sm:p-6 flex flex-col justify-between w-full">
                                                <div className="space-y-4 sm:space-y-5">
                                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-center bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                                                        ¡Sumate a la carrera!
                                                    </h2>

                                                    {error && (
                                                        <Alert color="failure" icon={HiOutlineInformationCircle} className="text-sm">
                                                            {error}
                                                        </Alert>
                                                    )}

                                                    <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                                                        <div>
                                                            <div className="mb-2 block">
                                                                <Label htmlFor="email" value="Correo Electrónico" className="text-sm" />
                                                            </div>
                                                            <TextInput
                                                                id="email"
                                                                type="email"
                                                                icon={HiOutlineMail}
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                placeholder="tu@email.com"
                                                                required
                                                                className="focus:ring-2 focus:ring-sky-400"
                                                                sizing="md"
                                                            />
                                                        </div>

                                                        <div>
                                                            <div className="mb-2 block">
                                                                <Label htmlFor="password" value="Contraseña" className="text-sm" />
                                                            </div>
                                                            <TextInput
                                                                id="password"
                                                                type="password"
                                                                icon={HiOutlineLockClosed}
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                placeholder="••••••••"
                                                                required
                                                                className="focus:ring-2 focus:ring-sky-400"
                                                                sizing="md"
                                                            />
                                                        </div>

                                                        <Button
                                                            type="submit"
                                                            className="w-full bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-sky-300"
                                                            disabled={isLoading}
                                                            size="lg"
                                                        >
                                                            {isLoading ? (
                                                                <>
                                                                    <Spinner size="sm" light={true} />
                                                                    <span className="ml-2">Ingresando...</span>
                                                                </>
                                                            ) : (
                                                                'INGRESAR'
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
                                                        onClick={handleGoogleLogin}
                                                        disabled={isLoading}
                                                        size="lg"
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Spinner size="sm" />
                                                                <span className="ml-2 text-sm">Iniciando sesión con Google...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <img
                                                                    className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3"
                                                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                                                    alt="Google Logo"
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                />
                                                                <span className="text-sm sm:text-base">Continuar con Google</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>

                                                <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
                                                    ¿No tenés cuenta?{' '}
                                                    <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                                                        Registrate aquí
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

export default Login;