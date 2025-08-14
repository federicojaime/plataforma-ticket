import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Button, Card, Spinner, TextInput, Label } from 'flowbite-react';
import {
    HiOutlineInformationCircle,
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineTicket,
    HiOutlineUserGroup,
    HiOutlineMusicNote,
    HiOutlineExclamation,
    HiOutlineClock
} from 'react-icons/hi';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { app } from '../config/firebase';
import Logo from "../assets/img/logo_blanco.png";
import EventoBanner from "../assets/img/festival.jpg";
import { useAuth } from '../context/AuthContext';
import Loading from './ui/Loading';
import Footer from './Footer';

// Configuración de mantenimiento
const MAINTENANCE_MODE = false; // Cambiar a false para desactivar el modo mantenimiento
const MAINTENANCE_CONFIG = {
    title: "Sitio en Mantenimiento",
    message: "Estamos realizando mejoras en nuestro sistema. Volveremos pronto.",
    estimatedTime: "30 minutos",
    contactEmail: "soporte@festival.com"
};

// Detecta navegadores internos problemáticos
const isInAppBrowser = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /FBAN|FBAV|Instagram|Line|Messenger|LinkedIn|Twitter|WhatsApp/i.test(userAgent);
};

// Función mejorada para obtener la URL del navegador externo
const getExternalBrowserUrl = (targetUrl) => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);

    if (isAndroid) {
        return {
            primary: `intent://${targetUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`,
            fallback: `googlechrome://navigate?url=${targetUrl}`
        };
    } else if (isIOS) {
        return {
            primary: `x-web-search://${targetUrl}`,
            fallback: targetUrl
        };
    }
    return { primary: targetUrl, fallback: targetUrl };
};

// Función para abrir en navegador externo
const openInExternalBrowser = () => {
    const currentUrl = window.location.href;

    const tryRedirect = () => {
        if (/android/i.test(navigator.userAgent)) {
            window.location.href = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=com.android.chrome;end`;

            setTimeout(() => {
                window.location.href = `market://details?id=com.android.chrome`;
            }, 2000);
        }
        else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            window.location.href = currentUrl;

            setTimeout(() => {
                window.location.replace(currentUrl);
            }, 2000);
        }
        else {
            window.open(currentUrl, '_system');
        }
    };

    alert('Para una mejor experiencia, la aplicación se abrirá en tu navegador predeterminado.');
    tryRedirect();
};

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { user, login, authLoading } = useAuth();

    useEffect(() => {
        if (isInAppBrowser()) {
            openInExternalBrowser();
        }
    }, []);

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/', { replace: true });
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    const firebaseUser = result.user;
                    const idToken = await firebaseUser.getIdToken();

                    if (!idToken) {
                        throw new Error('No se pudo obtener el token de Firebase');
                    }

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
                        throw new Error(data.message || 'Error en la respuesta del servidor');
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
                        throw new Error(data.msg || 'Error en la autenticación con Google');
                    }
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

            if (!idToken) {
                throw new Error('No se pudo obtener el token de Firebase');
            }

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
                throw new Error(data.message || 'Error en la respuesta del servidor');
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
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }

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

    const features = [
        { icon: HiOutlineTicket, text: "Comprá tus entradas", color: "text-cyan-600" },
        { icon: HiOutlineMusicNote, text: "Shows en vivo", color: "text-amber-500" },
        { icon: HiOutlineUserGroup, text: "Artesanos locales", color: "text-emerald-500" }
    ];

    // Componente de Mantenimiento
    const MaintenanceScreen = () => (
        <div className="relative z-10 w-full h-full py-8 px-4 md:py-12">
            <div className="max-w-3xl mx-auto">
                <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-none w-full">
                    <div className="text-center space-y-6">
                        <div className="flex justify-center mb-6">
                            <img
                                src={Logo}
                                alt="Logo"
                                className="h-16 md:h-24"
                            />
                        </div>

                        <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-amber-100">
                            <HiOutlineExclamation className="w-12 h-12 text-amber-600" />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                {MAINTENANCE_CONFIG.title}
                            </h2>
                            <p className="text-lg text-gray-600 mb-2">
                                {MAINTENANCE_CONFIG.message}
                            </p>
                            {/* <div className="flex items-center justify-center text-gray-500 space-x-2">
                                <HiOutlineClock className="w-5 h-5" />
                                <span>Tiempo estimado: {MAINTENANCE_CONFIG.estimatedTime}</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="inline-flex items-center justify-center space-x-2 bg-cyan-50 px-4 py-2 rounded-lg">
                                <HiOutlineMail className="w-5 h-5 text-cyan-600" />
                                <span className="text-cyan-700">{MAINTENANCE_CONFIG.contactEmail}</span>
                            </div>*/}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-xl p-4 md:p-6"
                                >
                                    <feature.icon className={`w-6 h-6 md:w-8 md:h-8 ${feature.color} mb-3 md:mb-4`} />
                                    <p className="text-base md:text-lg font-medium text-gray-700">{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    return (
        <main className="flex-1">
            <div className="min-h-[calc(100vh-64px)] w-full relative bg-gray-100">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={EventoBanner}
                        alt="Festival Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/90 via-cyan-800/50 to-amber-700/20 backdrop-blur-sm"></div>
                </div>

                {/* Renderizado condicional basado en el modo de mantenimiento */}
                {MAINTENANCE_MODE ? (
                    <MaintenanceScreen />
                ) : (
                    <div className="relative z-10 w-full h-full py-8 px-4 md:py-12">
                        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8">
                            {/* Left Section */}
                            <div className="w-full lg:w-1/2 text-white space-y-6 lg:space-y-8">
                                <div className="text-center lg:text-left">
                                    <img
                                        src={Logo}
                                        alt="Logo"
                                        className="h-16 md:h-24 mb-4 md:mb-6 mx-auto lg:mx-0"
                                    />
                                    <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 leading-tight">
                                        36° Festival Provincial del Artesano
                                    </h1>
                                    <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8">
                                        Celebrando nuestra cultura y tradición
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                                    {features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 hover:bg-white/20 transition-all"
                                        >
                                            <feature.icon className={`w-6 h-6 md:w-8 md:h-8 ${feature.color} mb-3 md:mb-4`} />
                                            <p className="text-base md:text-lg font-medium">{feature.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="w-full lg:w-1/2 max-w-md">
                                <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-none w-full">
                                    <div className="space-y-6 md:space-y-8 p-4 md:p-6">
                                        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                                            Bienvenido
                                        </h2>

                                        {error && (
                                            <Alert color="failure" icon={HiOutlineInformationCircle}>
                                                {error}
                                            </Alert>
                                        )}

                                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label htmlFor="email" value="Correo Electrónico" />
                                                </div>
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    icon={HiOutlineMail}
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="tu@email.com"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <div className="mb-2 block">
                                                    <Label htmlFor="password" value="Contraseña" />
                                                </div>
                                                <TextInput
                                                    id="password"
                                                    type="password"
                                                    icon={HiOutlineLockClosed}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                gradientDuoTone="cyanToBlue"
                                                className="w-full"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Spinner size="sm" light={true} />
                                                        <span className="ml-2">Iniciando sesión...</span>
                                                    </>
                                                ) : (
                                                    'Iniciar Sesión'
                                                )}
                                            </Button>
                                        </form>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-zinc-100 text-gray-500">O continúa con</span>
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <Button
                                                color="light"
                                                className="w-full"
                                                onClick={handleGoogleLogin}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Spinner size="sm" />
                                                        <span className="ml-2">Iniciando sesión con Google...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <img
                                                            className="h-5 w-5 mr-2"
                                                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                                                            alt="Google Logo"
                                                        />
                                                        Google
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        <p className="text-center text-sm text-gray-600">
                                            ¿No tenés cuenta?{' '}
                                            <Link to="/register" className="font-medium text-cyan-600 hover:text-cyan-500">
                                                Registrate aquí
                                            </Link>
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
};

export default Login;