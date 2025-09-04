import { useState } from 'react';
import { toast } from 'react-toastify';

const useDescuentos = (apiUrl) => {
    const [descuentoAplicado, setDescuentoAplicado] = useState(null);
    const [codigoDescuento, setCodigoDescuento] = useState('');
    const [aplicandoCodigo, setAplicandoCodigo] = useState(false);

    // Función para validar código de descuento con la API
    const validarCodigoDescuento = async (codigo) => {
        try {
            const response = await fetch(`${apiUrl}/descuento/validar/${codigo}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.ok && data.data) {
                return {
                    valido: true,
                    codigo: data.data.codigo,
                    nombre: data.data.nombre,
                    descuento: parseFloat(data.data.descuento),
                    disponible: data.data.disponible
                };
            } else {
                return {
                    valido: false,
                    mensaje: data.msg || 'Código no válido'
                };
            }
        } catch (error) {
            console.error('Error validando código:', error);
            return {
                valido: false,
                mensaje: 'Error al validar el código'
            };
        }
    };

    // Función para aplicar código de descuento
    const aplicarCodigoDescuento = async () => {
        if (!codigoDescuento.trim()) {
            toast.error('Por favor, ingresa un código de descuento');
            return;
        }

        setAplicandoCodigo(true);

        try {
            const resultado = await validarCodigoDescuento(codigoDescuento.trim());
            
            if (resultado.valido) {
                setDescuentoAplicado({
                    codigo: resultado.codigo,
                    nombre: resultado.nombre,
                    descuento: resultado.descuento
                });
                toast.success(`¡Código aplicado! Descuento de $${resultado.descuento.toLocaleString()} - ${resultado.nombre}`);
            } else {
                toast.error(resultado.mensaje);
            }
        } catch (error) {
            toast.error('Error al validar el código de descuento');
            console.error('Error:', error);
        } finally {
            setAplicandoCodigo(false);
        }
    };

    // Función para remover código de descuento
    const removerCodigoDescuento = () => {
        setDescuentoAplicado(null);
        setCodigoDescuento('');
        toast.info('Código de descuento removido');
    };

    // Función para usar el cupón (cuando se confirma el pago)
    const usarCupon = async (codigo, token) => {
        try {
            const response = await fetch(`${apiUrl}/descuento/usar/${codigo}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.ok) {
                console.log('Cupón usado exitosamente:', data);
                return true;
            } else {
                console.error('Error usando cupón:', data.msg);
                return false;
            }
        } catch (error) {
            console.error('Error usando cupón:', error);
            return false;
        }
    };

    return {
        descuentoAplicado,
        codigoDescuento,
        aplicandoCodigo,
        setCodigoDescuento,
        aplicarCodigoDescuento,
        removerCodigoDescuento,
        usarCupon,
        validarCodigoDescuento
    };
};

export default useDescuentos;