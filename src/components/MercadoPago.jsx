
import { useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const YourComponent = () => {
    useEffect(() => {
        initMercadoPago('APP_USR-183c9066-623b-4c32-b9c0-5aa292790efc', { locale: 'es-AR' });
    }, []);

    return (
        <div>
            <Wallet initialization={{ preferenceId: '1924207390-c314d50b-3c03-47b9-a168-5e1b5c1f0aaf' }} />
        </div>
    );
};

export default YourComponent;