import { useState, useRef, useEffect } from 'react';
import { Button, Checkbox, FileInput, Label, Select, TextInput, Card, Spinner, Radio } from 'flowbite-react';
import { HiOutlineTicket, HiOutlineUser, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineStar, HiOutlineExclamationCircle, HiOutlineTrash, HiOutlineUserRemove } from 'react-icons/hi';
import { FaTshirt, FaRunning, FaMedal } from 'react-icons/fa';
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

    // Funciones para calcular edad y categoría
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
        if (edad >= 15 && edad <= 19) return "15-19";
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
        return ""; // Para menores de 15 años
    };

    const [inscripcionesData, setInscripcionesData] = useState(null);
    const [idPreferencia, setIdPreferencia] = useState(null);
    const [mpInitialized, setMpInitialized] = useState(false);
    const certificadoMedico = useRef(null);
    const certificadoDiscapacidad = useRef(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

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
        tipo_inscripcion: 'regular',
        distancia: '5k' // 5k o 10k
    };

    const apiUrl = import.meta.env.VITE_API_URL;

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

        // Agregar personas para 5K
        for (let i = 0; i < datos['5k']; i++) {
            nuevasPersonas.push({
                ...personaTemplate,
                distancia: '5k'
            });
        }

        // Agregar personas para 10K
        for (let i = 0; i < datos['10k']; i++) {
            nuevasPersonas.push({
                ...personaTemplate,
                distancia: '10k'
            });
        }

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

    // Nueva función para manejar cuando se termina de escribir la fecha
    const handleFechaNacimientoBlur = (e) => {
        const value = e.target.value;
        if (!value) return;

        const edad = calcularEdad(value);
        const categoria = obtenerCategoria(edad);
        
        if (edad < 15) {
            toast.warning("La edad mínima para participar es 15 años");
            // Limpiar la fecha de nacimiento
            const newPersonas = [...personas];
            newPersonas[personaActual].fecha_nacimiento = '';
            newPersonas[personaActual].categoria_edad = '';
            setPersonas(newPersonas);
            return;
        }
        
        // Actualizar la categoría
        const newPersonas = [...personas];
        newPersonas[personaActual].categoria_edad = categoria;
        setPersonas(newPersonas);
        
        // Mostrar la edad calculada al usuario
        if (categoria) {
            toast.info(`Edad calculada: ${edad} años - Categoría: ${categoria}`);
        }
    };

    const validateFile = (file) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
        const maxSize = 7 * 1024 * 1024; // 7 MB in bytes

        if (!allowedTypes.includes(file.type)) {
            toast.error("El archivo debe ser PDF o JPG.");
            return false;
        }

        if (file.size > maxSize) {
            toast.error("El archivo debe ser menor a 7 MB.");
            return false;
        }

        return true;
    };

    const validatePersona = (persona) => {
        const errors = [];

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
        if (!persona.talle_remera) {
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

                if (personaEliminada.distancia === '5k') {
                    nuevasInscripciones['5k'] = Math.max(0, nuevasInscripciones['5k'] - 1);
                } else {
                    nuevasInscripciones['10k'] = Math.max(0, nuevasInscripciones['10k'] - 1);
                }

                // Recalcular total
                nuevasInscripciones.total = (nuevasInscripciones['5k'] * nuevasInscripciones.precios['5k']) +
                    (nuevasInscripciones['10k'] * nuevasInscripciones.precios['10k']);

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
        // Validar certificado médico para la persona actual
        if (!certificadoMedico.current.files[0]) {
            toast.error("El certificado médico es requerido.");
            return;
        }

        if (!validateFile(certificadoMedico.current.files[0])) {
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Agregar datos de todas las personas
            formDataToSend.append("personas", JSON.stringify(personas));
            formDataToSend.append("inscripciones", JSON.stringify(inscripcionesData));

            // Agregar certificado médico (por ahora uno para todos)
            formDataToSend.append("certificado_medico", certificadoMedico.current.files[0]);

            const response = await fetch(`${apiUrl}/carrera/registrar`, {
                headers: {
                    'Authorization': user.jwt,
                },
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();

            if (!data.ok) {
                toast.error(data.msg);
            } else {
                setIdPreferencia(data.data.idPreferencia);
                toast.success("Registro exitoso. Proceda al pago.");
            }
        } catch (error) {
            console.error('Error al procesar la inscripción:', error);
            toast.error('Error al procesar la inscripción');
        } finally {
            setLoading(false);
        }
    };

    const onMercadoPagoError = (error) => {
        console.error('Error en MercadoPago:', error);
        toast.error('Error en el proceso de pago');
        navigate('/fallo-pago');
    };

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
                            Persona {personaActual + 1} de {totalPersonas} - {personaActualData.distancia.toUpperCase()} {personaActualData.distancia === '5k' ? 'Recreativa' : 'Competitiva'}
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
                                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-blue-900 flex items-center">
                                            <HiOutlineUser className="mr-2" />
                                            Datos Personales - {personaActualData.distancia.toUpperCase()}
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="dni" value="DNI" />
                                            <TextInput
                                                id="dni"
                                                type="text"
                                                placeholder="Tu DNI"
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
                                                placeholder="Tu nombre"
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
                                                placeholder="Tu apellido"
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
                                                max="2010-09-07" // Máximo para tener al menos 15 años
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="genero" value="Género" />
                                            <Select id="genero" required value={personaActualData.genero} onChange={handleInputChange}>
                                                <option value="">Selecciona</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                                <option value="Otro">Otro</option>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Contacto */}
                                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                    <h3 className="text-xl font-bold mb-4 text-green-900 flex items-center">
                                        <HiOutlinePhone className="mr-2" /> Contacto
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                placeholder="Tu teléfono"
                                                required
                                                value={personaActualData.telefono}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                                    <h3 className="text-xl font-bold mb-4 text-purple-900 flex items-center">
                                        <HiOutlineLocationMarker className="mr-2" /> Dirección
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="domicilio" value="Domicilio" />
                                            <TextInput
                                                id="domicilio"
                                                type="text"
                                                placeholder="Tu domicilio"
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
                                                placeholder="Tu ciudad"
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
                                                placeholder="Tu provincia"
                                                required
                                                value={personaActualData.provincia}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="codigo_postal" value="Código Postal" />
                                            <TextInput
                                                id="codigo_postal"
                                                type="text"
                                                placeholder="Tu código postal"
                                                required
                                                value={personaActualData.codigo_postal}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contacto de Emergencia */}
                                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                                    <h3 className="text-xl font-bold mb-4 text-red-900 flex items-center">
                                        <HiOutlineExclamationCircle className="mr-2" /> Contacto de Emergencia
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
                                                <FaTshirt
                                                    className="ml-2 text-gray-500 cursor-pointer"
                                                    onMouseEnter={() => setShowSizeGuide(true)}
                                                    onMouseLeave={() => setShowSizeGuide(false)}
                                                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                                                />
                                            </Label>
                                            {showSizeGuide && (
                                                <div className="absolute z-10 p-2 bg-white border rounded shadow-lg">
                                                    <img src={tallesImageUrl} alt="Guía de talles" className="max-w-xs" />
                                                </div>
                                            )}
                                            <Select id="talle_remera" required value={personaActualData.talle_remera} onChange={handleInputChange}>
                                                <option value="">Selecciona</option>
                                                <option value="XS">XS</option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                                <option value="XXL">XXL</option>
                                            </Select>
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
                                                        `${personaActualData.categoria_edad} años` : 
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

                                {/* Certificado médico (solo para la última persona) */}
                                {personaActual === totalPersonas - 1 && (
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                        <h3 className="text-xl font-bold mb-4 text-gray-900">Documentación</h3>
                                        <div>
                                            <Label htmlFor="certificado_medico" value="Certificado Médico (para todos los participantes)" />
                                            <FileInput id="certificado_medico" ref={certificadoMedico} />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Formato: PDF o JPG. Máximo 7MB. Un certificado vale para todos los participantes de esta inscripción.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Términos y condiciones */}
                                <div className="space-y-4">
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
                                            'Finalizar y Pagar →'
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
                                {inscripcionesData['5k'] > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-blue-600/20 rounded-lg border border-blue-400/30">
                                        <div className="flex items-center gap-2">
                                            <FaRunning className="text-blue-400" />
                                            <span>5K Recreativa × {inscripcionesData['5k']}</span>
                                        </div>
                                        <span className="font-bold">${(inscripcionesData['5k'] * inscripcionesData.precios['5k']).toLocaleString()}</span>
                                    </div>
                                )}

                                {inscripcionesData['10k'] > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-purple-600/20 rounded-lg border border-purple-400/30">
                                        <div className="flex items-center gap-2">
                                            <FaMedal className="text-purple-400" />
                                            <span>10K Competitiva × {inscripcionesData['10k']}</span>
                                        </div>
                                        <span className="font-bold">${(inscripcionesData['10k'] * inscripcionesData.precios['10k']).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-600 pt-4 mb-6">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-bold">Total a pagar:</span>
                                    <span className="font-black text-2xl text-blue-400">
                                        ${inscripcionesData.total.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">
                                    Total de personas: {totalPersonas}
                                </p>
                            </div>

                            {/* Lista de personas */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-300 mb-3">Participantes:</h3>
                                {personas.map((persona, index) => (
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
                                                <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-200">
                                                    {persona.distancia.toUpperCase()}
                                                </span>
                                                {persona.categoria_edad && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-green-200">
                                                        {persona.categoria_edad}
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
                                ))}
                            </div>

                            {/* Botón de pago (solo si ya hay preferencia) */}
                            {idPreferencia && mpInitialized && (
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