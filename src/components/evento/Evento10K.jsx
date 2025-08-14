import { Link, Route, Router, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/corredor.jpg";
import { HiOutlineClock, HiOutlineLocationMarker, HiOutlineCalendar } from "react-icons/hi";
import useMpContext from "../Mp/storemp/useMpContext";


const Evento = () => {

    return (
        <div className="bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                    <img src={Logo} alt="San Francisco Corre 10k" className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <h1 className="absolute bottom-4 left-4 text-4xl font-bold text-white">San Francisco Corre 10k</h1>
                </div>

                <div className="p-6">
                    <p className="text-gray-700 mb-6">Preparate para la 1ra Edición de San Francisco Corre, organizado por el Municipio de San Francisco.</p>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <EventInfo icon={HiOutlineCalendar} title="Fecha y Hora" info="1 de Agosto de 2024 - 08:00hs." />
                        <EventInfo icon={HiOutlineLocationMarker} title="Ubicación" info="Dique las palmeras, San Francisco, Provincia de San Luis." />
                        <EventInfo icon={HiOutlineClock} title="Cierre de Inscripciones" info="10 de Septiembre de 2024 - 18:00hs." />
                    </div>

                    <hr className="border-gray-300 my-8" />

                    <h2 className="text-2xl font-semibold mb-4 text-[#00263b]">Inscribite ahora</h2>
                    <p className="text-gray-700 mb-6">Incluye: Remera del evento, número de corredor.</p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <TicketOption id="1" title="Quiero correr los 5K" price="$12.000" />
                        <TicketOption id="2" title="Quiero correr los 10K" price="$15.000" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventInfo = ({ icon: Icon, title, info }) => (
    <div className="flex items-start">
        <Icon className="text-2xl text-[#4baccc] mr-3 mt-1" />
        <div>
            <h2 className="text-lg font-semibold text-[#00263b] mb-1">{title}</h2>
            <p className="text-gray-700">{info}</p>
        </div>
    </div>
);

const TicketOption = ({ id, title, price }) => {
    const navigate = useNavigate();

    const { dispatch, options } = useMpContext();
    const irComprar = () => {
        let payload = {
            cantidad: 1,
            id: 1,
            idmp: "109498109-b087c07b-616c-464c-b1a5-12fbfe4e51f3",
            initpoint: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=109498109-b087c07b-616c-464c-b1a5-12fbfe4e51f3",
            precio: 10000,
            titulo: "Carrera 5k"
        }

        if (id == 2) {
            payload = {
                cantidad: 1,
                id: 2,
                idmp: "109498109-b087c07b-616c-464c-b1a5-12fbfe4e51f3",
                initpoint: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=109498109-b087c07b-616c-464c-b1a5-12fbfe4e51f3",
                precio: 15000,
                titulo: "Carrera 10k"
            }
        }
        dispatch({
            type: options.MP_SET_ITEM_SELECTED, payload: payload
        })
        navigate("/registrar_compra");
    }

    return (
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-[#00263b] mb-2">{title}</h3>
            <p className="text-[#e7ac2a] font-semibold mb-4">Desde {price}</p>
            <button onClick={irComprar} className="w-full px-4 py-2 bg-[#4baccc] text-white rounded-md hover:bg-[#00263b] transition-colors">
                Inscribirme
            </button>
        </div>
    )
};

export default Evento;