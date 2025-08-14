import { useState, useRef, useEffect } from 'react';
import { Button, Checkbox, FileInput, Label, Select, TextInput, Card, Spinner, Radio } from 'flowbite-react';
import { HiOutlineTicket, HiOutlineUser, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineStar, HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaTshirt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../../assets/img/corredor.jpg";
import { useAuth } from '../../context/AuthContext';
import Mp from "../Mp/Mp";
import useMpContext from '../Mp/storemp/useMpContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const Registrar_compra = () => {
    const tallesImageUrl = "https://vivisanfrancisco.com/ticket/assets/images/talles.jpg";
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const navigate = useNavigate();

    const { state } = useMpContext();
    const [idPreferencia, setIdPreferencia] = useState(null);
    const certificadoMedico = useRef(null);
    const certificadoDiscapacidad = useRef(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        usuario_id: '',
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
        pais: '',
        codigo_postal: '',
        contacto_emergencia_nombre: '',
        contacto_emergencia_apellido: '',
        contacto_emergencia_telefono: '',
        talle_remera: '',
        team_agrupacion: '',
        categoria_edad: '',
        codigo_descuento: '',
        acepta_promocion: false,
        acepta_reglamento: false,
        acepta_deslinde: false,
        tipo_inscripcion: 'regular',
        tipo_discapacidad: '',
    });
    const [precio, setPrecio] = useState(state.itemSelected.precio);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (formData.tipo_inscripcion === 'deporte_adaptado' || formData.tipo_inscripcion === 'kids') {
            setPrecio(0);
            setFormData(prev => ({
                ...prev,
                talle_remera: '', // Aseguramos que el talle de remera se vacíe
                codigo_descuento: '',
                categoria_edad: formData.tipo_inscripcion === 'kids' ? 'Menores de 13' : prev.categoria_edad
            }));
        } else {
            setPrecio(state.itemSelected.precio);
        }

        if (formData.tipo_inscripcion !== 'deporte_adaptado') {
            setFormData(prev => ({ ...prev, tipo_discapacidad: '' }));
        }
    }, [formData.tipo_inscripcion, state.itemSelected.precio]);

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : value
        }));
    };
    const handleInscripcionChange = async (tipo) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Cambiar el tipo de inscripción reiniciará el formulario.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            setFormData({
                usuario_id: '',
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
                pais: '',
                codigo_postal: '',
                contacto_emergencia_nombre: '',
                contacto_emergencia_apellido: '',
                contacto_emergencia_telefono: '',
                talle_remera: '',
                team_agrupacion: '',
                categoria_edad: '',
                codigo_descuento: '',
                acepta_promocion: false,
                acepta_reglamento: false,
                acepta_deslinde: false,
                tipo_inscripcion: tipo,
                tipo_discapacidad: '',
            });
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

    const validateForm = () => {
        const errors = [];

        if (!/^\d{7,8}$/.test(formData.dni)) {
            errors.push("El DNI debe tener entre 7 y 8 dígitos.");
        }
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/.test(formData.nombre)) {
            errors.push("El nombre debe contener solo letras, espacios y acentos, entre 2 y 50 caracteres.");
        }
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/.test(formData.apellido)) {
            errors.push("El apellido debe contener solo letras, espacios y acentos, entre 2 y 50 caracteres.");
        }
        if (!formData.fecha_nacimiento) {
            errors.push("La fecha de nacimiento es requerida.");
        }
        if (!formData.genero) {
            errors.push("El género es requerido.");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push("El email no es válido.");
        }
        if (!/^\d{10}$/.test(formData.telefono)) {
            errors.push("El teléfono debe contener 10 dígitos.");
        }
        if (!formData.domicilio) {
            errors.push("El domicilio es requerido.");
        }
        if (!formData.ciudad) {
            errors.push("La ciudad es requerida.");
        }
        if (!formData.provincia) {
            errors.push("La provincia es requerida.");
        }
        if (!formData.pais) {
            errors.push("El país es requerido.");
        }
        if (!/^\d{4,5}$/.test(formData.codigo_postal)) {
            errors.push("El código postal debe tener entre 4 y 5 dígitos.");
        }
        if (!formData.contacto_emergencia_nombre) {
            errors.push("El nombre del contacto de emergencia es requerido.");
        }
        if (!formData.contacto_emergencia_apellido) {
            errors.push("El apellido del contacto de emergencia es requerido.");
        }
        if (!/^\d{10}$/.test(formData.contacto_emergencia_telefono)) {
            errors.push("El teléfono del contacto de emergencia debe contener 10 dígitos.");
        }
        if (formData.tipo_inscripcion === 'regular' && !formData.talle_remera) {
            errors.push("El talle de remera es requerido para inscripciones regulares.");
        }
        if (!formData.categoria_edad) {
            errors.push("La categoría de edad es requerida.");
        }
        if (!certificadoMedico.current.files[0]) {
            errors.push("El certificado médico es requerido.");
        } else if (!validateFile(certificadoMedico.current.files[0])) {
            errors.push("El certificado médico no cumple con los requisitos.");
        }
        if (formData.tipo_inscripcion === 'deporte_adaptado') {
            if (!certificadoDiscapacidad.current.files[0]) {
                errors.push("El certificado de discapacidad es requerido para esta categoría.");
            } else if (!validateFile(certificadoDiscapacidad.current.files[0])) {
                errors.push("El certificado de discapacidad no cumple con los requisitos.");
            }
        }
        if (formData.tipo_inscripcion === 'kids') {
            const birthDate = new Date(formData.fecha_nacimiento);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age > 13) {
                errors.push("Para la categoría Kids, el participante no debe ser mayor de 13 años.");
            }
        }

        if (!formData.acepta_reglamento) {
            errors.push("Debe leer y aceptar el reglamento de la carrera para continuar.");
        }

        if (!formData.acepta_deslinde) {
            errors.push("Debe leer y aceptar el deslinde de responsabilidad para continuar.");
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        setLoading(true);
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });
        formDataToSend.append("idItem", state.itemSelected.id);
        formDataToSend.append("certificado_medico", certificadoMedico.current.files[0]);

        if (formData.tipo_inscripcion === 'deporte_adaptado') {
            formDataToSend.append("certificado_discapacidad", certificadoDiscapacidad.current.files[0]);
        }

        // Marcar como pagado para inscripciones especiales
        if (formData.tipo_inscripcion === 'deporte_adaptado' || formData.tipo_inscripcion === 'kids') {
            formDataToSend.append("pagado", "1");
        }

        try {
            let endpoint = `${apiUrl}/registrar/evento`;
            if (formData.tipo_inscripcion === 'kids' || formData.tipo_inscripcion === 'deporte_adaptado') {
                endpoint = `${apiUrl}/registrar/evento-especial`;
            }

            const response = await fetch(endpoint, {
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
                if (formData.tipo_inscripcion === 'regular') {
                    setIdPreferencia(data.data.idPreferencia);
                    toast.success("Registro exitoso. Proceda al pago.");
                } else {
                    toast.success("Registro exitoso.");
                    navigate('/inscripcion-exito');
                }
            }
        } catch (error) {
            console.error('Error al procesar la inscripción:', error);
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="mx-auto mr-1 mb-2 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                    <img src={Logo} alt="10K Del Maestro" className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <h1 className="absolute bottom-4 left-4 text-4xl font-bold text-white">10K Del Maestro</h1>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2">
                <div className="lg:col-span-2">
                    <Card>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 text-[#00263b] flex items-center">
                                <HiOutlineStar className="mr-2" /> Tipo de Inscripción
                            </h3>
                            <div className="flex items-center space-x-4">
                                <Radio
                                    id="regular"
                                    name="tipo_inscripcion"
                                    value="regular"
                                    checked={formData.tipo_inscripcion === 'regular'}
                                    onChange={() => handleInscripcionChange('regular')}
                                />
                                <Label htmlFor="regular">Regular</Label>

                                <Radio
                                    id="deporte_adaptado"
                                    name="tipo_inscripcion"
                                    value="deporte_adaptado"
                                    checked={formData.tipo_inscripcion === 'deporte_adaptado'}
                                    onChange={() => handleInscripcionChange('deporte_adaptado')}
                                />
                                <Label htmlFor="deporte_adaptado">Deporte Adaptado</Label>

                                <Radio
                                    id="kids"
                                    name="tipo_inscripcion"
                                    value="kids"
                                    checked={formData.tipo_inscripcion === 'kids'}
                                    onChange={() => handleInscripcionChange('kids')}
                                />
                                <Label htmlFor="kids">Kids</Label>
                            </div>

                            <h3 className="text-xl font-semibold mb-4 text-[#00263b] flex items-center">
                                <HiOutlineUser className="mr-2" /> Datos Personales
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="dni" value="DNI" />
                                    <TextInput id="dni" type="text" placeholder="Tu DNI" required value={formData.dni} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="nombre" value="Nombre" />
                                    <TextInput id="nombre" type="text" placeholder="Tu nombre" required value={formData.nombre} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="apellido" value="Apellido" />
                                    <TextInput id="apellido" type="text" placeholder="Tu apellido" required value={formData.apellido} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="fecha_nacimiento" value="Fecha de Nacimiento" />
                                    <TextInput id="fecha_nacimiento" type="date" required value={formData.fecha_nacimiento} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="genero" value="Género" />
                                    <Select id="genero" required value={formData.genero} onChange={handleInputChange}>
                                        <option value="">Selecciona</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="Otro">Otro</option>
                                    </Select>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-4 text-[#00263b] flex items-center">
                                <HiOutlinePhone className="mr-2" /> Contacto
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email" value="Email" />
                                    <TextInput id="email" type="email" placeholder="tu@email.com" required value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="telefono" value="Teléfono" />
                                    <TextInput id="telefono" type="tel" placeholder="Tu teléfono" required value={formData.telefono} onChange={handleInputChange} />
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-4 text-[#00263b] flex items-center">
                                <HiOutlineLocationMarker className="mr-2" /> Dirección
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="domicilio" value="Domicilio" />
                                    <TextInput id="domicilio" type="text" placeholder="Tu domicilio" required value={formData.domicilio} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="ciudad" value="Ciudad" />
                                    <TextInput id="ciudad" type="text" placeholder="Tu ciudad" required value={formData.ciudad} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="provincia" value="Provincia" />
                                    <TextInput id="provincia" type="text" placeholder="Tu provincia" required value={formData.provincia} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="pais" value="País" />
                                    <TextInput id="pais" type="text" placeholder="Tu país" required value={formData.pais} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="codigo_postal" value="Código Postal" />
                                    <TextInput id="codigo_postal" type="text" placeholder="Tu código postal" required value={formData.codigo_postal} onChange={handleInputChange} />
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-4 text-[#00263b] flex items-center">
                                <HiOutlineExclamationCircle className="mr-2" /> Contacto de Emergencia
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="contacto_emergencia_nombre" value="Nombre" />
                                    <TextInput id="contacto_emergencia_nombre" type="text" placeholder="Nombre" required value={formData.contacto_emergencia_nombre} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="contacto_emergencia_apellido" value="Apellido" />
                                    <TextInput id="contacto_emergencia_apellido" type="text" placeholder="Apellido" required value={formData.contacto_emergencia_apellido} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="contacto_emergencia_telefono" value="Teléfono" />
                                    <TextInput id="contacto_emergencia_telefono" type="tel" placeholder="Teléfono" required value={formData.contacto_emergencia_telefono} onChange={handleInputChange} />
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-4 text-[#00263b] flex items-center">
                                <HiOutlineStar className="mr-2" /> Información Adicional
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.tipo_inscripcion === 'deporte_adaptado' && (
                                    <div>
                                        <Label htmlFor="tipo_discapacidad" value="Tipo de Discapacidad" />
                                        <Select
                                            id="tipo_discapacidad"
                                            required
                                            value={formData.tipo_discapacidad}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Selecciona</option>
                                            <option value="Motriz">Motriz</option>
                                            <option value="Intelectual">Intelectual</option>
                                            <option value="Visual">Visual</option>
                                            <option value="Auditiva">Auditiva</option>
                                            <option value="Psicosocial">Psicosocial</option>
                                        </Select>
                                    </div>
                                )}

                                {formData.tipo_inscripcion === 'regular' && (
                                    <>
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
                                            <Select id="talle_remera" required value={formData.talle_remera} onChange={handleInputChange}>
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
                                            <Label htmlFor="codigo_descuento" value="Código de Descuento" />
                                            <TextInput id="codigo_descuento" type="text" placeholder="Código de descuento" value={formData.codigo_descuento} onChange={handleInputChange} />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <Label htmlFor="team_agrupacion" value="Team o Agrupación" />
                                    <TextInput id="team_agrupacion" type="text" placeholder="Tu team o agrupación" value={formData.team_agrupacion} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="categoria_edad" value="Categoría de Edad" />
                                    {formData.tipo_inscripcion === 'kids' ? (
                                        <Select id="categoria_edad" required value={formData.categoria_edad} onChange={handleInputChange} disabled>
                                            <option value="Menores de 13">Menores de 13</option>
                                        </Select>
                                    ) : (
                                        <Select id="categoria_edad" required value={formData.categoria_edad} onChange={handleInputChange}>
                                            <option value="">Selecciona</option>
                                            <option value="15-19">15-19</option>
                                            <option value="20-24">20-24</option>
                                            <option value="25-29">25-29</option>
                                            <option value="30-34">30-34</option>
                                            <option value="35-39">35-39</option>
                                            <option value="40-44">40-44</option>
                                            <option value="45-49">45-49</option>
                                            <option value="50-54">50-54</option>
                                            <option value="55-59">55-59</option>
                                            <option value="60-64">60-64</option>
                                            <option value="65-69">65-69</option>
                                            <option value="70-74">70-74</option>
                                            <option value="75-79">75-79</option>
                                            <option value="80+">80+</option>
                                        </Select>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="certificado_medico" value="Certificado Médico" />
                                <FileInput id="certificado_medico" ref={certificadoMedico} />
                            </div>

                            {formData.tipo_inscripcion === 'deporte_adaptado' && (
                                <div>
                                    <Label htmlFor="certificado_discapacidad" value="Certificado de Discapacidad" />
                                    <FileInput id="certificado_discapacidad" ref={certificadoDiscapacidad} />
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="acepta_promocion"
                                    checked={formData.acepta_promocion}
                                    onChange={handleInputChange}
                                />
                                <Label htmlFor="acepta_promocion">
                                    Acepto que mi imagen pueda ser utilizada para fines promocionales del evento.
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="acepta_reglamento"
                                    checked={formData.acepta_reglamento}
                                    onChange={handleInputChange}
                                />
                                <Label htmlFor="acepta_reglamento">
                                    Declaro haber leído y acepto el <a href='https://vivisanfrancisco.com/recursos/reglamento.pdf' style={{ color: "blue" }} target='_blank'>reglamento oficial de la carrera 10K Del Maestro.</a>
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="acepta_deslinde"
                                    checked={formData.acepta_deslinde}
                                    onChange={handleInputChange}
                                />
                                <Label htmlFor="acepta_deslinde">
                                    He leído y acepto el <a href='https://vivisanfrancisco.com/recursos/deslinde.pdf' style={{ color: "blue" }} target='_blank'>deslinde de responsabilidad.</a>
                                </Label>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" color="warning" disabled={formData.tipo_inscripcion === 'regular' && idPreferencia}>
                                    {loading ? <Spinner size="sm" /> :
                                        formData.tipo_inscripcion === 'regular' ? "Registrar y Proceder al Pago" : "Registrar"
                                    }
                                </Button>
                            </div>
                        </form>
                        <div className="text-center text-xs text-gray-500 mt-4">
                            Si necesitas ayuda, por favor <a href="https://instagram.com/codeo.ar" target='_blank' className="text-blue-500 hover:text-blue-700 underline">contáctanos</a>.
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 mr-1">
                    <Card className="sticky top-4">
                        <h2 className="text-xl font-bold mb-4 text-[#00263b] flex items-center">
                            <HiOutlineTicket className="mr-2" /> Resumen de Pago
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="font-medium">Categoría:</span>
                                <span>{state.itemSelected.titulo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Cantidad:</span>
                                <span>{state.itemSelected.cantidad}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                {formData.tipo_inscripcion === 'deporte_adaptado' || formData.tipo_inscripcion === 'kids' ? (
                                    <span>
                                        <span className="line-through mr-2">${state.itemSelected.precio}</span>
                                        <span className="text-green-600">Gratis</span>
                                    </span>
                                ) : (
                                    <span>${precio}</span>
                                )}
                            </div>
                        </div>
                        {formData.tipo_inscripcion === 'regular' && <Mp idPreferencia={idPreferencia} />}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Registrar_compra;