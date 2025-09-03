import { useState, useEffect } from 'react';
import { Button, Checkbox, Label, Select, TextInput, Card, Spinner } from 'flowbite-react';
import { HiOutlineTicket, HiOutlineUser, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineStar, HiOutlineExclamationCircle, HiOutlineTrash, HiOutlineUserRemove, HiOutlineHeart } from 'react-icons/hi';
import { FaTshirt, FaRunning, FaMedal, FaChild, FaWheelchair } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo10K from "../../assets/img/10k.png";
import RunnerBanner from "../../assets/img/runner-banner.jpg";
import { useAuth } from '../../context/AuthContext';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Registrar_compra = () => {
    const tallesImageUrl = "https://vivisanfrancisco.com/ticket/assets/images/talles.jpg";
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const navigate = useNavigate();

    // Funciones para calcular edad y categoría - CORREGIDAS PARA PERMITIR 15 AÑOS EN 5K/10K
    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return 0;

        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);

        // Fecha del evento: 7 de septiembre 2025
        const fechaEvento = new Date('2025-09-07');

        let edad = fechaEvento.getFullYear() - nacimiento.getFullYear();
        const mesEvento = fechaEvento.getMonth();
        const mesNacimiento = nacimiento.getMonth();

        if (mesEvento < mesNacimiento || (mesEvento === mesNacimiento && fechaEvento.getDate() < nacimiento.getDate())) {
            edad--;
        }

        return edad;
    };

    const obtenerCategoria = (edad) => {
        // CORREGIDO: Ahora los de 15 años pueden ir a 5K/10K, Kids solo para menores de 15
        if (edad < 15) return "kids"; // Solo menores de 15 años
        if (edad >= 15 && edad <= 19) return "15-19"; // Incluye los de 15 años
        if (edad >= 20 && edad <= 24) return "20-24";
        if (edad >= 25 && edad <= 29) return "25-29";
        if (edad >= 30 && edad <= 34) return "30-34";
        if (edad >= 35 && edad <= 39) return "35-39";
        if (edad >= 40 && edad <= 44) return "40-44";
        if (edad >= 45 && edad <= 49) return "45-49";
        if (edad >= 50 && edad <= 54) return "50-54";
        if (edad >= 55 && edad <= 59) return "55-59";
        if (edad >= 60 && edad <= 64) return "60-64";
        if (edad >= 65 && edad <= 69) return "65-69";
        if (edad >= 70 && edad <= 74) return "70-74";
        if (edad >= 75 && edad <= 79) return "75-79";
        if (edad >= 80) return "80+";
        return "";
    };

    const [inscripcionesData, setInscripcionesData] = useState(null);
    const [idPreferencia, setIdPreferencia] = useState(null);
    const [mpInitialized, setMpInitialized] = useState(false);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Estados para códigos de descuento
    const [codigoDescuento, setCodigoDescuento] = useState('');
    const [descuentoAplicado, setDescuentoAplicado] = useState(null);
    const [aplicandoCodigo, setAplicandoCodigo] = useState(false);

    // Estados para cada persona que se va a inscribir
    const [personas, setPersonas] = useState([]);
    const [personaActual, setPersonaActual] = useState(0);

    const personaTemplate = {
        dni: '',
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        genero: '',
        email: '',
        telefono: '',
        domicilio: '',
        ciudad: '',
        provincia: '',
        pais: 'Argentina',
        codigo_postal: '',
        contacto_emergencia_nombre: '',
        contacto_emergencia_apellido: '',
        contacto_emergencia_telefono: '',
        talle_remera: '',
        team_agrupacion: '',
        categoria_edad: '',
        acepta_promocion: false,
        acepta_reglamento: false,
        acepta_deslinde: false,
        declara_certificado_medico: false,
        declara_certificado_discapacidad: false,
        tipo_inscripcion: 'regular',
        distancia: '5k', // 5k, 10k, kid, discapacitado
    };

    const CATEGORIES_INFO = {
        '5k': {
            name: '5K Categoría',
            icon: FaRunning,
            color: 'blue'
        },
        '10k': {
            name: '10K Categoría',
            icon: FaMedal,
            color: 'purple'
        },
        'kid': {
            name: 'Categoría Kids',
            icon: FaChild,
            color: 'green'
        },
        'discapacitado': {
            name: 'Categoría adaptado',
            icon: FaWheelchair,
            color: 'orange'
        }
    };

    const apiUrl = import.meta.env.VITE_API_URL;

    // Códigos de descuento hardcodeados (basados en la tabla)
    const CODIGOS_DESCUENTO = {
        'RUR9': { nombre: 'RUN URBANO', descuento: 2000 },
        'MEC2': { nombre: 'MERCURIO', descuento: 2000 },
        'MPC3': { nombre: 'MERCEDES PISTA Y CAMPO', descuento: 2000 },
        'PIV5': { nombre: 'PARQUE IV CENTENARIO', descuento: 2000 },
        'UNS1': { nombre: 'UNIVERSIDAD NACIONAL DE SAN LUIS', descuento: 2000 },
        'LLI4': { nombre: 'LOS LINCES', descuento: 2000 },
        'ZAR7': { nombre: 'ZARIGUEYAS RUNNING', descuento: 2000 },
        'PRY1': { nombre: 'PROYECTO 1', descuento: 2000 },
        'ESR6': { nombre: 'ESTATU RUN', descuento: 2000 },
        'CAE8': { nombre: 'CENTRO DE ALTO RENDIMIENTO DEPORTIVO (CARD)', descuento: 2000 },
        'ACG3': { nombre: 'AGRUPACION CLAUDIO GUTIERREZ', descuento: 2000 },
        'MEMISA5K': { nombre: 'Influencer', descuento: 14999 },
        'MEMISA10K': { nombre: 'Influencer', descuento: 17999 },
        'INVITADO5k': { nombre: 'Invitado de la municipalidad', descuento: 14999 },
        'INVITADO10k': { nombre: 'Invitado de la municipalidad', descuento: 17999 }
    };

    // Cargar datos de inscripciones al montar el componente
    useEffect(() => {
        const datosGuardados = localStorage.getItem('inscripciones-seleccionadas');
        if (!datosGuardados) {
            toast.error('No hay inscripciones seleccionadas');
            navigate('/');
            return;
        }

        const datos = JSON.parse(datosGuardados);
        setInscripcionesData(datos);

        // Crear array de personas según las inscripciones
        const nuevasPersonas = [];

        // Agregar personas para cada categoría
        const categorias = ['5k', '10k', 'kid', 'discapacitado'];

        categorias.forEach(categoria => {
            if (datos[categoria]) {
                for (let i = 0; i < datos[categoria]; i++) {
                    const nuevaPersona = {
                        ...personaTemplate,
                        distancia: categoria
                    };

                    // Para categorías gratuitas, no incluir talle de remera
                    if (categoria === 'kid' || categoria === 'discapacitado') {
                        nuevaPersona.talle_remera = 'No incluido';
                    }

                    nuevasPersonas.push(nuevaPersona);
                }
            }
        });

        setPersonas(nuevasPersonas);
    }, [navigate]);

    // Inicializar MercadoPago
    useEffect(() => {
        const initializeMp = async () => {
            try {
                initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
                setMpInitialized(true);
            } catch (error) {
                console.error('Error initializing MercadoPago:', error);
                toast.error('Error al inicializar el sistema de pago');
            }
        };
        initializeMp();
    }, []);

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        const newPersonas = [...personas];

        // Actualizar el valor
        newPersonas[personaActual] = {
            ...newPersonas[personaActual],
            [id]: type === 'checkbox' ? checked : value
        };

        setPersonas(newPersonas);
    };

    // Función para aplicar código de descuento
    const aplicarCodigoDescuento = () => {
        if (!codigoDescuento.trim()) {
            toast.error('Por favor, ingresa un código de descuento');
            return;
        }

        setAplicandoCodigo(true);

        setTimeout(() => {
            const codigoUpper = codigoDescuento.trim().toUpperCase();
            const descuento = CODIGOS_DESCUENTO[codigoUpper];

            if (descuento) {
                setDescuentoAplicado({
                    codigo: codigoUpper,
                    ...descuento
                });
                toast.success(`¡Código aplicado! Descuento de ${descuento.descuento} - ${descuento.nombre}`);
            } else {
                toast.error('Código de descuento inválido');
            }
            setAplicandoCodigo(false);
        }, 1000);
    };

    // Función para remover código de descuento
    const removerCodigoDescuento = () => {
        setDescuentoAplicado(null);
        setCodigoDescuento('');
        toast.info('Código de descuento removido');
    };

    // Nueva función para manejar cuando se termina de escribir la fecha - CORREGIDA
    const handleFechaNacimientoBlur = (e) => {
        const value = e.target.value;
        if (!value) return;

        const edad = calcularEdad(value);
        const categoria = obtenerCategoria(edad);

        // VALIDACIONES CORREGIDAS: Los de 15 años PUEDEN inscribirse en 5K/10K
        if (personaActualData.distancia === 'kid' && edad >= 15) {
            toast.error(`Esta persona tiene ${edad} años. La categoría Kids es solo para menores de 15 años. Por favor, cambia a una categoría apropiada.`);
            return;
        }

        if ((personaActualData.distancia === '5k' || personaActualData.distancia === '10k') && edad < 15) {
            toast.error(`Esta persona tiene ${edad} años. Las categorías 5K y 10K requieren al menos 15 años. Te recomendamos la categoría Kids para menores de 15.`);
            return;
        }

        // Actualizar la categoría
        const newPersonas = [...personas];
        newPersonas[personaActual].categoria_edad = categoria;
        setPersonas(newPersonas);

        // Mostrar información relevante al usuario
        if (edad < 15 && newPersonas[personaActual].distancia !== 'kid') {
            toast.info(`Edad calculada: ${edad} años - Categoría Kids recomendada (menores de 15 años)`);
        } else if (categoria) {
            toast.success(`Edad calculada: ${edad} años - Categoría: ${categoria}`);
        }
    };

    const validateFile = (file) => {
        // Ya no necesitamos validar archivos porque no se suben
        return true;
    };

    const validatePersona = (persona) => {
        const errors = [];
        const edad = calcularEdad(persona.fecha_nacimiento);

        if (!/^\d{7,8}$/.test(persona.dni)) {
            errors.push("El DNI debe tener entre 7 y 8 dígitos.");
        }
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/.test(persona.nombre)) {
            errors.push("El nombre debe contener solo letras, espacios y acentos, entre 2 y 50 caracteres.");
        }
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/.test(persona.apellido)) {
            errors.push("El apellido debe contener solo letras, espacios y acentos, entre 2 y 50 caracteres.");
        }
        if (!persona.fecha_nacimiento) {
            errors.push("La fecha de nacimiento es requerida.");
        }

        // VALIDACIONES DE EDAD CORREGIDAS: Los de 15 años PUEDEN ir a 5K/10K
        if (persona.distancia === 'kid' && edad >= 15) {
            errors.push(`Esta persona tiene ${edad} años. La categoría Kids es solo para menores de 15 años.`);
        }
        if ((persona.distancia === '5k' || persona.distancia === '10k') && edad < 15) {
            errors.push(`Esta persona tiene ${edad} años. Las categorías 5K y 10K requieren al menos 15 años de edad.`);
        }

        if (!persona.genero) {
            errors.push("El género es requerido.");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(persona.email)) {
            errors.push("El email no es válido.");
        }
        if (!/^\d{10}$/.test(persona.telefono)) {
            errors.push("El teléfono debe contener 10 dígitos.");
        }
        if (!persona.domicilio) {
            errors.push("El domicilio es requerido.");
        }
        if (!persona.ciudad) {
            errors.push("La ciudad es requerida.");
        }
        if (!persona.provincia) {
            errors.push("La provincia es requerida.");
        }
        if (!/^\d{4,5}$/.test(persona.codigo_postal)) {
            errors.push("El código postal debe tener entre 4 y 5 dígitos.");
        }
        if (!persona.contacto_emergencia_nombre) {
            errors.push("El nombre del contacto de emergencia es requerido.");
        }
        if (!persona.contacto_emergencia_apellido) {
            errors.push("El apellido del contacto de emergencia es requerido.");
        }
        if (!/^\d{10}$/.test(persona.contacto_emergencia_telefono)) {
            errors.push("El teléfono del contacto de emergencia debe contener 10 dígitos.");
        }

        // Solo validar talle de remera para categorías que la incluyen
        if ((persona.distancia === '5k' || persona.distancia === '10k') && !persona.talle_remera) {
            errors.push("El talle de remera es requerido.");
        }

        if (!persona.categoria_edad) {
            errors.push("La categoría de edad es requerida. Asegúrate de haber ingresado la fecha de nacimiento.");
        }
        if (!persona.acepta_reglamento) {
            errors.push("Debe leer y aceptar el reglamento de la carrera para continuar.");
        }
        if (!persona.acepta_deslinde) {
            errors.push("Debe leer y aceptar el deslinde de responsabilidad para continuar.");
        }
        if (!persona.declara_certificado_medico) {
            errors.push("Debe declarar que llevará su certificado médico para retirar el kit deportivo.");
        }

        // Validación para certificado de discapacidad si es categoría inclusiva
        if (persona.distancia === 'discapacitado' && !persona.declara_certificado_discapacidad) {
            errors.push("Debe declarar que llevará su certificado de discapacidad para la categoría adaptado.");
        }

        return errors;
    };

    const handleEliminarPersona = (indexToDelete) => {
        if (personas.length <= 1) {
            toast.warning("Debe haber al menos una persona inscrita.");
            return;
        }

        // Mostrar confirmación
        Swal.fire({
            title: '¿Eliminar participante?',
            text: `¿Estás seguro de que querés eliminar a ${personas[indexToDelete].nombre || `Persona ${indexToDelete + 1}`}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const nuevasPersonas = personas.filter((_, index) => index !== indexToDelete);
                setPersonas(nuevasPersonas);

                // Actualizar inscripciones data
                const personaEliminada = personas[indexToDelete];
                const nuevasInscripciones = { ...inscripcionesData };

                if (nuevasInscripciones[personaEliminada.distancia]) {
                    nuevasInscripciones[personaEliminada.distancia] = Math.max(0, nuevasInscripciones[personaEliminada.distancia] - 1);
                }

                // Recalcular total
                nuevasInscripciones.total = Object.keys(nuevasInscripciones.precios).reduce((total, key) => {
                    if (nuevasInscripciones[key]) {
                        return total + (nuevasInscripciones[key] * nuevasInscripciones.precios[key]);
                    }
                    return total;
                }, 0);

                setInscripcionesData(nuevasInscripciones);

                // Actualizar localStorage
                localStorage.setItem('inscripciones-seleccionadas', JSON.stringify(nuevasInscripciones));

                // Ajustar persona actual si es necesario
                if (personaActual >= nuevasPersonas.length) {
                    setPersonaActual(Math.max(0, nuevasPersonas.length - 1));
                } else if (indexToDelete <= personaActual && personaActual > 0) {
                    setPersonaActual(personaActual - 1);
                }

                toast.success("Participante eliminado correctamente.");
            }
        });
    };

    const handleSiguientePersona = () => {
        const errors = validatePersona(personas[personaActual]);
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        if (personaActual < personas.length - 1) {
            setPersonaActual(personaActual + 1);
        } else {
            // Última persona, proceder al pago
            handleFinalizarInscripcion();
        }
    };

    const handleAnteriorPersona = () => {
        if (personaActual > 0) {
            setPersonaActual(personaActual - 1);
        }
    };

    const handleFinalizarInscripcion = async () => {
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Agregar datos de todas las personas
            formDataToSend.append("personas", JSON.stringify(personas));

            // Agregar datos de inscripciones con descuento aplicado
            const inscripcionesConDescuento = {
                ...inscripcionesData,
                total: totalConDescuento,
                descuento: descuentoAplicado
            };
            formDataToSend.append("inscripciones", JSON.stringify(inscripcionesConDescuento));

            const response = await fetch(`${apiUrl}/carrera/registrar`, {
                headers: {
                    'Authorization': user.jwt,
                },
                method: 'POST',
                body: formDataToSend
            });

            // Verificar si la respuesta es válida
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data); // Para debug

            if (!data.ok) {
                throw new Error(data.msg || 'Error desconocido en el servidor');
            } else {
                // Si hay inscripciones gratuitas únicamente o el total con descuento es 0, redirigir directamente a éxito
                if (totalConDescuento === 0 || data.data?.tipo === 'gratuita') {
                    toast.success("¡Inscripción completada exitosamente!");
                    // Limpiar localStorage
                    localStorage.removeItem('inscripciones-seleccionadas');
                    setTimeout(() => {
                        navigate('/inscripcion-exito');
                    }, 1000);
                } else if (data.data?.idPreferencia) {
                    setIdPreferencia(data.data.idPreferencia);
                    toast.success("Registro exitoso. Proceda al pago.");
                } else {
                    throw new Error('Respuesta inesperada del servidor');
                }
            }
        } catch (error) {
            console.error('Error detallado:', error);
            toast.error(error.message || 'Error al procesar la inscripción');
        } finally {
            setLoading(false);
        }
    };

    const onMercadoPagoError = (error) => {
        console.error('Error en MercadoPago:', error);
        toast.error('Error en el proceso de pago');
        navigate('/fallo-pago');
    };

    const getDistanciaInfo = (distancia) => {
        return CATEGORIES_INFO[distancia] || CATEGORIES_INFO['5k'];
    };

    const isGratuita = (distancia) => {
        return distancia === 'kid' || distancia === 'discapacitado';
    };

    // Verificar si hay inscripciones de discapacitado para mostrar declaración adicional
    const tieneInscripcionDiscapacitado = personas.some(persona => persona.distancia === 'discapacitado');

    // Calcular totales con descuento
    const totalSinDescuento = Object.keys(inscripcionesData || {}).reduce((total, key) => {
        if (key !== 'precios' && key !== 'total' && inscripcionesData[key]) {
            return total + (inscripcionesData[key] * (inscripcionesData.precios?.[key] || 0));
        }
        return total;
    }, 0);

    const montoDescuento = descuentoAplicado ? descuentoAplicado.descuento : 0;
    const totalConDescuento = Math.max(0, totalSinDescuento - montoDescuento);
    const hayInscripcionesPagas = totalSinDescuento > 0;

    if (!inscripcionesData || personas.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Spinner size="xl" />
                    <p className="mt-4 text-lg font-semibold text-gray-700">Cargando formulario...</p>
                </div>
            </div>
        );
    }

    const personaActualData = personas[personaActual];
    const totalPersonas = personas.length;
    const distanciaInfo = getDistanciaInfo(personaActualData.distancia);

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-right" autoClose={5000} />

            {/* Hero Banner */}
            <div className="relative h-[30vh] overflow-hidden">
                <img src={RunnerBanner} alt="10K Del Maestro" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white space-y-4">
                        <img
                            src={Logo10K}
                            alt="Logo 10K"
                            className="h-20 mx-auto drop-shadow-2xl"
                        />
                        <h1 className="text-3xl md:text-4xl font-black">Datos de Inscripción</h1>
                        <p className="text-lg">
                            Persona {personaActual + 1} de {totalPersonas} - {distanciaInfo.name}
                            {isGratuita(personaActualData.distancia) && (
                                <span className="ml-2 inline-flex items-center gap-1 text-green-400">
                                    <HiOutlineHeart className="w-4 h-4" />
                                    GRATUITA
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg">
                            <form className="space-y-6">
                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Progreso: {personaActual + 1} de {totalPersonas}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {Math.round(((personaActual + 1) / totalPersonas) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${((personaActual + 1) / totalPersonas) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Datos Personales */}
                                <div className={`${distanciaInfo.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                                    distanciaInfo.color === 'purple' ? 'bg-purple-50 border-purple-200' :
                                        distanciaInfo.color === 'green' ? 'bg-green-50 border-green-200' :
                                            'bg-orange-50 border-orange-200'} rounded-xl p-6 border`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className={`text-xl font-bold flex items-center ${distanciaInfo.color === 'blue' ? 'text-blue-900' :
                                            distanciaInfo.color === 'purple' ? 'text-purple-900' :
                                                distanciaInfo.color === 'green' ? 'text-green-900' :
                                                    'text-orange-900'
                                            }`}>
                                            <distanciaInfo.icon className="mr-2" />
                                            Datos Personales - {distanciaInfo.name}
                                            {isGratuita(personaActualData.distancia) && (
                                                <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                                                    GRATUITA
                                                </span>
                                            )}
                                        </h3>
                                        {personas.length > 1 && (
                                            <Button
                                                type="button"
                                                color="failure"
                                                size="sm"
                                                onClick={() => handleEliminarPersona(personaActual)}
                                                className="flex items-center gap-2"
                                            >
                                                <HiOutlineTrash className="w-4 h-4" />
                                                Eliminar
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="dni" value="DNI" />
                                            <TextInput
                                                id="dni"
                                                type="text"
                                                placeholder="DNI sin puntos"
                                                required
                                                value={personaActualData.dni}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="nombre" value="Nombre" />
                                            <TextInput
                                                id="nombre"
                                                type="text"
                                                placeholder="Nombre"
                                                required
                                                value={personaActualData.nombre}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="apellido" value="Apellido" />
                                            <TextInput
                                                id="apellido"
                                                type="text"
                                                placeholder="Apellido"
                                                required
                                                value={personaActualData.apellido}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="fecha_nacimiento" value="Fecha de Nacimiento" />
                                            <TextInput
                                                id="fecha_nacimiento"
                                                type="date"
                                                required
                                                value={personaActualData.fecha_nacimiento}
                                                onChange={handleInputChange}
                                                onBlur={handleFechaNacimientoBlur}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="genero" value="Género" />
                                            <Select id="genero" required value={personaActualData.genero} onChange={handleInputChange}>
                                                <option value="">Selecciona</option>
                                                <option value="masculino">Masculino</option>
                                                <option value="femenino">Femenino</option>
                                                <option value="otro">Otro</option>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="email" value="Email" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                placeholder="tu@email.com"
                                                required
                                                value={personaActualData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="telefono" value="Teléfono" />
                                            <TextInput
                                                id="telefono"
                                                type="tel"
                                                placeholder="2664123456"
                                                required
                                                value={personaActualData.telefono}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="domicilio" value="Domicilio" />
                                            <TextInput
                                                id="domicilio"
                                                type="text"
                                                placeholder="Dirección completa"
                                                required
                                                value={personaActualData.domicilio}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="ciudad" value="Ciudad" />
                                            <TextInput
                                                id="ciudad"
                                                type="text"
                                                placeholder="Ciudad"
                                                required
                                                value={personaActualData.ciudad}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="provincia" value="Provincia" />
                                            <TextInput
                                                id="provincia"
                                                type="text"
                                                placeholder="Provincia"
                                                required
                                                value={personaActualData.provincia}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="pais" value="País" />
                                            <TextInput
                                                id="pais"
                                                type="text"
                                                value={personaActualData.pais}
                                                onChange={handleInputChange}
                                                readOnly
                                                className="bg-gray-100 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="codigo_postal" value="Código Postal" />
                                            <TextInput
                                                id="codigo_postal"
                                                type="text"
                                                placeholder="5700"
                                                required
                                                value={personaActualData.codigo_postal}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contacto de emergencia */}
                                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                                    <h3 className="text-xl font-bold mb-4 text-red-900 flex items-center">
                                        <HiOutlinePhone className="mr-2" /> Contacto de Emergencia
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="contacto_emergencia_nombre" value="Nombre" />
                                            <TextInput
                                                id="contacto_emergencia_nombre"
                                                type="text"
                                                placeholder="Nombre"
                                                required
                                                value={personaActualData.contacto_emergencia_nombre}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="contacto_emergencia_apellido" value="Apellido" />
                                            <TextInput
                                                id="contacto_emergencia_apellido"
                                                type="text"
                                                placeholder="Apellido"
                                                required
                                                value={personaActualData.contacto_emergencia_apellido}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="contacto_emergencia_telefono" value="Teléfono" />
                                            <TextInput
                                                id="contacto_emergencia_telefono"
                                                type="tel"
                                                placeholder="Teléfono"
                                                required
                                                value={personaActualData.contacto_emergencia_telefono}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Información de la carrera */}
                                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                                    <h3 className="text-xl font-bold mb-4 text-yellow-900 flex items-center">
                                        <FaRunning className="mr-2" /> Información de la Carrera
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <Label htmlFor="talle_remera" className="flex items-center mb-2">
                                                Talle de Remera
                                                {(personaActualData.distancia === 'kid' || personaActualData.distancia === 'discapacitado') && (
                                                    <span className="ml-2 text-sm text-gray-500">(No incluido)</span>
                                                )}
                                                {(personaActualData.distancia === '5k' || personaActualData.distancia === '10k') && (
                                                    <FaTshirt
                                                        className="ml-2 text-gray-500 cursor-pointer"
                                                        onMouseEnter={() => setShowSizeGuide(true)}
                                                        onMouseLeave={() => setShowSizeGuide(false)}
                                                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                                                    />
                                                )}
                                            </Label>
                                            {showSizeGuide && (personaActualData.distancia === '5k' || personaActualData.distancia === '10k') && (
                                                <div className="absolute z-10 p-2 bg-white border rounded shadow-lg">
                                                    <img src={tallesImageUrl} alt="Guía de talles" className="max-w-xs" />
                                                </div>
                                            )}
                                            {(personaActualData.distancia === 'kid' || personaActualData.distancia === 'discapacitado') ? (
                                                <TextInput
                                                    id="talle_remera"
                                                    type="text"
                                                    value="No incluido"
                                                    readOnly
                                                    className="bg-gray-100 cursor-not-allowed"
                                                />
                                            ) : (
                                                <Select id="talle_remera" required value={personaActualData.talle_remera} onChange={handleInputChange}>
                                                    <option value="">Selecciona</option>
                                                    <option value="XS">XS</option>
                                                    <option value="S">S</option>
                                                    <option value="M">M</option>
                                                    <option value="L">L</option>
                                                    <option value="XL">XL</option>
                                                    <option value="XXL">XXL</option>
                                                </Select>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="team_agrupacion" value="Team o Agrupación (Opcional)" />
                                            <TextInput
                                                id="team_agrupacion"
                                                type="text"
                                                placeholder="Tu team o agrupación"
                                                value={personaActualData.team_agrupacion}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="categoria_edad" value="Categoría de Edad" />
                                            <div className="relative">
                                                <TextInput
                                                    id="categoria_edad_display"
                                                    type="text"
                                                    value={personaActualData.categoria_edad ?
                                                        `${personaActualData.categoria_edad} ${personaActualData.categoria_edad === 'kids' ? '(menores de 15)' : 'años'}` :
                                                        'Selecciona fecha de nacimiento primero'
                                                    }
                                                    readOnly
                                                    className="bg-gray-100 cursor-not-allowed"
                                                />
                                                {personaActualData.fecha_nacimiento && (
                                                    <div className="mt-1 text-sm text-gray-600">
                                                        Edad al 7 de Septiembre 2025: {calcularEdad(personaActualData.fecha_nacimiento)} años
                                                    </div>
                                                )}
                                            </div>
                                            {/* Campo oculto para enviar el valor real */}
                                            <input
                                                type="hidden"
                                                id="categoria_edad"
                                                value={personaActualData.categoria_edad}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Certificados y documentación - Solo para la última persona */}
                                {personaActual === totalPersonas - 1 && tieneInscripcionDiscapacitado && (
                                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                                        <h3 className="text-xl font-bold mb-4 text-orange-900">Documentación Especial</h3>
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="declara_certificado_discapacidad"
                                                checked={personas.some(p => p.distancia === 'discapacitado') ?
                                                    personas.find(p => p.distancia === 'discapacitado')?.declara_certificado_discapacidad || false : false}
                                                onChange={(e) => {
                                                    const newPersonas = [...personas];
                                                    newPersonas.forEach(persona => {
                                                        if (persona.distancia === 'discapacitado') {
                                                            persona.declara_certificado_discapacidad = e.target.checked;
                                                        }
                                                    });
                                                    setPersonas(newPersonas);
                                                }}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <Label htmlFor="declara_certificado_discapacidad" className="text-orange-900 font-semibold">
                                                    Certificado de Discapacidad
                                                </Label>
                                                <p className="text-orange-800 text-sm mt-1">
                                                    Declaro que llevaré mi certificado de discapacidad para validar mi participación en la categoría adaptado el día del evento.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Términos y condiciones */}
                                <div className="space-y-4">
                                    {/* Declaración del certificado médico */}
                                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="declara_certificado_medico"
                                                checked={personaActualData.declara_certificado_medico}
                                                onChange={handleInputChange}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <Label htmlFor="declara_certificado_medico" className="text-blue-900 font-semibold">
                                                    Certificado Médico
                                                </Label>
                                                <p className="text-blue-800 text-sm mt-1">
                                                    {(personaActualData.distancia === 'kid' || personaActualData.distancia === 'discapacitado')
                                                        ? "Declaro que llevaré mi certificado médico apto para la práctica deportiva el día del evento."
                                                        : "Declaro que llevaré mi certificado médico apto para la práctica deportiva para retirar el kit deportivo el día del evento."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="acepta_promocion"
                                            checked={personaActualData.acepta_promocion}
                                            onChange={handleInputChange}
                                        />
                                        <Label htmlFor="acepta_promocion">
                                            Acepto que mi imagen pueda ser utilizada para fines promocionales del evento.
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="acepta_reglamento"
                                            checked={personaActualData.acepta_reglamento}
                                            onChange={handleInputChange}
                                        />
                                        <Label htmlFor="acepta_reglamento">
                                            Declaro haber leído y acepto el <a href='https://vivisanfrancisco.com/recursos/reglamento.pdf' style={{ color: "blue" }} target='_blank'>reglamento oficial de la carrera 10K Del Maestro.</a>
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="acepta_deslinde"
                                            checked={personaActualData.acepta_deslinde}
                                            onChange={handleInputChange}
                                        />
                                        <Label htmlFor="acepta_deslinde">
                                            He leído y acepto el <a href='https://vivisanfrancisco.com/recursos/deslinde.pdf' style={{ color: "blue" }} target='_blank'>deslinde de responsabilidad.</a>
                                        </Label>
                                    </div>
                                </div>

                                {/* Botones de navegación */}
                                <div className="flex justify-between pt-6">
                                    <Button
                                        type="button"
                                        color="gray"
                                        onClick={handleAnteriorPersona}
                                        disabled={personaActual === 0}
                                    >
                                        ← Anterior
                                    </Button>

                                    <Button
                                        type="button"
                                        color="blue"
                                        onClick={handleSiguientePersona}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Spinner size="sm" />
                                        ) : personaActual === totalPersonas - 1 ? (
                                            inscripcionesData.total === 0 ? 'Finalizar Inscripción →' : 'Finalizar y Pagar →'
                                        ) : (
                                            'Siguiente →'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Resumen lateral */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none">
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <HiOutlineTicket className="mr-2 text-blue-400" />
                                Resumen de Inscripción
                            </h2>

                            <div className="space-y-4 mb-6">
                                {Object.keys(inscripcionesData).map(key => {
                                    if (key !== 'precios' && key !== 'total' && inscripcionesData[key] > 0) {
                                        const categoryInfo = CATEGORIES_INFO[key];
                                        const isGratuitaCategory = isGratuita(key);
                                        const colorClass = categoryInfo.color === 'blue' ? 'bg-blue-600/20 border-blue-400/30' :
                                            categoryInfo.color === 'purple' ? 'bg-purple-600/20 border-purple-400/30' :
                                                categoryInfo.color === 'green' ? 'bg-green-600/20 border-green-400/30' :
                                                    'bg-orange-600/20 border-orange-400/30';
                                        const iconColor = categoryInfo.color === 'blue' ? 'text-blue-400' :
                                            categoryInfo.color === 'purple' ? 'text-purple-400' :
                                                categoryInfo.color === 'green' ? 'text-green-400' :
                                                    'text-orange-400';

                                        return (
                                            <div key={key} className={`flex justify-between items-center p-3 rounded-lg border ${colorClass}`}>
                                                <div className="flex items-center gap-2">
                                                    <categoryInfo.icon className={iconColor} />
                                                    <span>{categoryInfo.name} × {inscripcionesData[key]}</span>
                                                    {isGratuitaCategory && (
                                                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                                            GRATIS
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="font-bold">
                                                    {isGratuitaCategory ? 'GRATIS' : `${(inscripcionesData[key] * inscripcionesData.precios[key]).toLocaleString()}`}
                                                </span>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            {/* Código de descuento - Solo para inscripciones pagas */}
                            {hayInscripcionesPagas && (
                                <div className="border-t border-gray-600 pt-4 mb-4">
                                    <h3 className="font-semibold text-gray-300 mb-3">Código de Descuento</h3>
                                    {!descuentoAplicado ? (
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <TextInput
                                                    id="codigoDescuento"
                                                    type="text"
                                                    placeholder="Ingresa tu código"
                                                    value={codigoDescuento}
                                                    onChange={(e) => setCodigoDescuento(e.target.value.toUpperCase())}
                                                    className="flex-1"
                                                    onKeyPress={(e) => e.key === 'Enter' && aplicarCodigoDescuento()}
                                                />
                                                <Button
                                                    onClick={aplicarCodigoDescuento}
                                                    disabled={aplicandoCodigo || !codigoDescuento.trim()}
                                                    className="bg-green-600 hover:bg-green-700"
                                                    size="sm"
                                                >
                                                    {aplicandoCodigo ? <Spinner size="sm" /> : 'Aplicar'}
                                                </Button>
                                            </div>
                                            <p className="text-xs text-gray-400">
                                                Si perteneces a una institución deportiva, ingresa tu código para obtener descuento.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-3">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-green-400">{descuentoAplicado.codigo}</p>
                                                    <p className="text-xs text-green-300">{descuentoAplicado.nombre}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-green-400">-${descuentoAplicado.descuento.toLocaleString()}</span>
                                                    <Button
                                                        onClick={removerCodigoDescuento}
                                                        color="failure"
                                                        size="xs"
                                                    >
                                                        ✕
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="border-t border-gray-600 pt-4 mb-6">
                                <div className="space-y-2">
                                    {totalSinDescuento > 0 && (
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <span>Subtotal:</span>
                                            <span>${totalSinDescuento.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {descuentoAplicado && (
                                        <div className="flex justify-between text-sm text-green-400">
                                            <span>Descuento ({descuentoAplicado.codigo}):</span>
                                            <span>-${descuentoAplicado.descuento.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-gray-600 pt-2 mt-2">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-bold">Total a pagar:</span>
                                        <span className="font-black text-2xl text-blue-400">
                                            {totalConDescuento === 0 ? (
                                                <span className="flex items-center gap-2 text-green-400">
                                                    <HiOutlineHeart />
                                                    GRATIS
                                                </span>
                                            ) : (
                                                `${totalConDescuento.toLocaleString()}`
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">
                                    Total de personas: {totalPersonas}
                                </p>
                                {totalConDescuento === 0 && totalSinDescuento > 0 && (
                                    <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                                        <HiOutlineHeart className="w-4 h-4" />
                                        ¡Descuento total aplicado!
                                    </p>
                                )}
                                {totalSinDescuento === 0 && (
                                    <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                                        <HiOutlineHeart className="w-4 h-4" />
                                        ¡Inscripción completamente gratuita!
                                    </p>
                                )}
                            </div>

                            {/* Lista de personas */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-300 mb-3">Participantes:</h3>
                                {personas.map((persona, index) => {
                                    const personaInfo = getDistanciaInfo(persona.distancia);
                                    return (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg border transition-all ${index === personaActual
                                                ? 'bg-blue-600/30 border-blue-400 text-white'
                                                : 'bg-gray-700/50 border-gray-600 text-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">
                                                    {persona.nombre || `Persona ${index + 1}`}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${personaInfo.color === 'blue' ? 'bg-blue-600 text-blue-200' :
                                                        personaInfo.color === 'purple' ? 'bg-purple-600 text-purple-200' :
                                                            personaInfo.color === 'green' ? 'bg-green-600 text-green-200' :
                                                                'bg-orange-600 text-orange-200'
                                                        }`}>
                                                        {personaInfo.name}
                                                    </span>
                                                    {isGratuita(persona.distancia) && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-green-500 text-green-200">
                                                            GRATIS
                                                        </span>
                                                    )}
                                                    {persona.categoria_edad && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-green-200">
                                                            {persona.categoria_edad === 'kids' ? 'Kids' : persona.categoria_edad}
                                                        </span>
                                                    )}
                                                    {personas.length > 1 && (
                                                        <button
                                                            onClick={() => handleEliminarPersona(index)}
                                                            className="text-red-400 hover:text-red-300 p-1 rounded"
                                                            title="Eliminar participante"
                                                        >
                                                            <HiOutlineUserRemove className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {index === personaActual && (
                                                <p className="text-xs text-blue-300 mt-1">← Completando datos</p>
                                            )}
                                            {persona.fecha_nacimiento && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Edad: {calcularEdad(persona.fecha_nacimiento)} años
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Botón de pago (solo si ya hay preferencia y hay que pagar) */}
                            {idPreferencia && mpInitialized && totalConDescuento > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-600">
                                    <h3 className="font-semibold mb-3 text-green-400">¡Datos completos!</h3>
                                    <Wallet
                                        initialization={{ preferenceId: idPreferencia }}
                                        customization={{
                                            texts: {
                                                action: 'Pagar inscripción',
                                                valueProp: 'Pago seguro con Mercado Pago'
                                            },
                                            visual: {
                                                buttonBackground: '#2563eb',
                                                borderRadius: '12px'
                                            }
                                        }}
                                        onError={onMercadoPagoError}
                                    />
                                </div>
                            )}

                            {/* Mensaje para inscripciones gratuitas */}
                            {totalConDescuento === 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-600">
                                    <div className="text-center p-4 bg-green-600/20 rounded-lg border border-green-400/30">
                                        <HiOutlineHeart className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                        <h3 className="font-semibold text-green-400 mb-2">
                                            {totalSinDescuento > 0 ? '¡Inscripción con Descuento Total!' : '¡Inscripción Gratuita!'}
                                        </h3>
                                        <p className="text-sm text-green-300">
                                            {totalSinDescuento > 0
                                                ? 'Tu descuento cubre el costo total de la inscripción.'
                                                : 'Solo necesitas completar todos los datos para finalizar tu inscripción.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="text-center text-xs text-gray-400 mt-6">
                                Si necesitas ayuda, por favor <a href="https://instagram.com/codeo.ar" target='_blank' className="text-blue-400 hover:text-blue-300 underline">contáctanos</a>.
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registrar_compra;