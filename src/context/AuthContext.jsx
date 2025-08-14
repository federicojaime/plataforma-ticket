import { createContext, useContext, useState, useEffect } from 'react';

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
                
                const json = await response.json();
                if (json.ok && json.data && json.data.id) {
                    const userData = { ...json.data, jwt: token };
                    login(userData);
                } else {
                    logout();
                }
            } catch (error) {
                console.error('Error validando token:', error);
                logout();
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