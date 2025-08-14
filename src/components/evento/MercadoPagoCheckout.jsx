import { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { toast } from 'react-toastify';

const MercadoPagoCheckout = ({
    preferenceId,
    onSuccess,
    onPending,
    onError
}) => {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Inicializar MercadoPago con tu public key
        const mpPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
        if (mpPublicKey) {
            initMercadoPago(mpPublicKey);
            setInitialized(true);
        } else {
            toast.error('Error al inicializar MercadoPago');
        }
    }, []);

    const customization = {
        texts: {
            action: 'Pagar la compra',
            valueProp: 'Pago seguro con Mercado Pago'
        },
        visual: {
            buttonBackground: '#17b1be',
            borderRadius: '8px'
        }
    };

    if (!initialized || !preferenceId) {
        return (
            <div className="w-full p-4 text-center">
                <div className="animate-pulse h-12 bg-gray-200 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Wallet
                initialization={{ preferenceId: preferenceId }}
                customization={customization}
                onReady={() => console.log('Checkout listo')}
                onError={(error) => {
                    console.error('Error en el checkout:', error);
                    if (onError) onError(error);
                }}
                onSubmit={() => console.log('Pago iniciado')}
            />
        </div>
    );
};

export default MercadoPagoCheckout;