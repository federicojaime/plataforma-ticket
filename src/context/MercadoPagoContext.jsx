// src/context/MercadoPagoContext.jsx
import { createContext } from 'react';

export const MercadoPagoContext = createContext({
    mpInitialized: false
});

export default MercadoPagoContext;