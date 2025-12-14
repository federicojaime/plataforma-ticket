import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Intentar recuperar el usuario del localStorage al iniciar
        const token = localStorage.getItem("tikets-token");
        const savedUser = localStorage.getItem("tikets-user");
        if (token && savedUser) {
            try {
                return { ...JSON.parse(savedUser), jwt: token };
            } catch (e) {
                return null;
            }
        }
        return null;
    });
    const [authLoading, setAuthLoading] = useState(true);

    const login = (userData) => {
        // Guardar tanto el token como los datos del usuario
        localStorage.setItem("tikets-token", userData.jwt);
        localStorage.setItem("tikets-user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("tikets-token");
        localStorage.removeItem("tikets-user");
        setUser(null);
    };

    const forceLogoutDueToExpiredToken = () => {
        console.log('🚫 Token vencido - Forzando logout');
        logout();
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        // Forzar redirección
        setTimeout(() => {
            window.location.href = '/ticket/login';
        }, 1000);
    };

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("tikets-token");
            if (!token) {
                setAuthLoading(false);
                return;
            }

            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/user/token/validate/${token}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                
                console.log('🔍 Validación token - Status:', response.status);
                
                if (response.status === 401 || response.status === 403) {
                    console.log('❌ Token vencido en validación inicial');
                    forceLogoutDueToExpiredToken();
                    return;
                }
                
                const json = await response.json();
                if (json.ok && json.data && json.data.id) {
                    const userData = { ...json.data, jwt: token };
                    login(userData);
                } else {
                    console.log('❌ Respuesta inválida del servidor');
                    forceLogoutDueToExpiredToken();
                }
            } catch (error) {
                console.error('Error validando token:', error);
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    toast.error('Error de conexión. Verifica tu conexión a internet.');
                } else {
                    forceLogoutDueToExpiredToken();
                }
            } finally {
                setAuthLoading(false);
            }
        };

        if (!user) {
            validateToken();
        } else {
            setAuthLoading(false);
        }
    }, []);

    // Interceptor global para detectar 401/403 en cualquier request
    useEffect(() => {
        const originalFetch = window.fetch;
        
        window.fetch = async (url, options = {}) => {
            const response = await originalFetch(url, options);
            
            const apiUrl = import.meta.env.VITE_API_URL;
            if ((response.status === 401 || response.status === 403) && 
                url.includes(apiUrl) && 
                !url.includes('/login') && 
                !url.includes('/register') &&
                !url.includes('/token/validate') &&
                user?.jwt) {
                
                console.log('🚫 Token vencido detectado en request:', url, 'Status:', response.status);
                forceLogoutDueToExpiredToken();
            }
            
            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [user]);

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            authLoading,
            isAuthenticated: !!user 
        }}>
            {!authLoading ? children : <div>Cargando...</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};