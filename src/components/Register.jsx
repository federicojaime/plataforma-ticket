import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Alert, Button, Card, Spinner, TextInput, Label } from 'flowbite-react';
import {
    HiOutlineInformationCircle,
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineUser
} from 'react-icons/hi';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import Logo from "../assets/img/logo_blanco.png";
import EventoBanner from "../assets/img/festival.jpg";
import useForm from './utils';
import Footer from './Footer';

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
                throw new Error(data.errores[0]|| 'Error en la autenticación con Google');
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

    const features = [
        { icon: HiOutlineUser, text: "Creá tu cuenta", color: "text-cyan-600" },
        { icon: HiOutlineMail, text: "Recibí novedades", color: "text-amber-500" },
        { icon: HiOutlineLockClosed, text: "Compras seguras", color: "text-emerald-500" }
    ];

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

                {/* Content */}
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
                                    Creá tu cuenta
                                </h1>
                                <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8">
                                    Y sé parte del 36° Festival Provincial del Artesano
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
                                <div className="space-y-6 p-4 md:p-6">
                                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                                        Registrá tu cuenta
                                    </h2>

                                    {error && (
                                        <Alert color="failure" icon={HiOutlineInformationCircle}>
                                            {error}
                                        </Alert>
                                    )}

                                    <form className="space-y-4" onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="firstname" value="Nombre" />
                                                <TextInput
                                                    id="firstname"
                                                    name="firstname"
                                                    value={dataUser.firstname}
                                                    onChange={cambiarValores}
                                                    placeholder="Tu nombre"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastname" value="Apellido" />
                                                <TextInput
                                                    id="lastname"
                                                    name="lastname"
                                                    value={dataUser.lastname}
                                                    onChange={cambiarValores}
                                                    placeholder="Tu apellido"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="email" value="Correo Electrónico" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                icon={HiOutlineMail}
                                                value={dataUser.email}
                                                onChange={cambiarValores}
                                                placeholder="tu@email.com"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="password" value="Contraseña" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                icon={HiOutlineLockClosed}
                                                value={dataUser.password}
                                                onChange={cambiarValores}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="confirmPassword" value="Confirmar Contraseña" />
                                            <TextInput
                                                id="confirmPassword"
                                                type="password"
                                                name="confirmPassword"
                                                icon={HiOutlineLockClosed}
                                                value={dataUser.confirmPassword}
                                                onChange={cambiarValores}
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
                                                    <span className="ml-2">Registrando...</span>
                                                </>
                                            ) : (
                                                'Registrarse'
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
                                        ¿Ya tenés cuenta?{' '}
                                        <Link to="/login" className="font-medium text-cyan-600 hover:text-cyan-500">
                                            Iniciá sesión aquí
                                        </Link>
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </main>
    );
};

export default Register;