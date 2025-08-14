import { useEffect, useState } from "react";
import { VITE_BACK_END_URL } from "../../../config";

const Historial = () => {
    const [loading, setLoading] = useState(true);
    const [historia, setHistoria] = useState([]);

    useEffect(() => {
        const getHistoria = async () => {
            const response = await fetch(`${VITE_BACK_END_URL}mp/historial`);
            const json = await response.json();
            setHistoria(json.data);
        }
        getHistoria().finally(setLoading(false));
    }, []);

    if (loading || historia.length === 0 || historia) return <div>Loading</div>;

    return (
        <div className="Historial relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Usuario</th>
                        <th scope="col" className="px-6 py-3">Fecha</th>
                        <th scope="col" className="px-6 py-3">Hora</th>
                        <th scope="col" className="px-6 py-3">ID Transacción</th>
                        <th scope="col" className="px-6 py-3">Estado</th>
                        <th scope="col" className="px-6 py-3">detalle</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        historia.map((i) => {
                            return (
                                <tr key={`r-${i.id}`}>
                                    <td className="px-6 py-4">{i.iduser}</td>
                                    <td className="px-6 py-4">{i.fecha}</td>
                                    <td className="px-6 py-4">{i.hora}</td>
                                    <td className="px-6 py-4">{i.idpago}</td>
                                    <td className="px-6 py-4">{i.estado}</td>
                                    <td className="px-6 py-4">{i.detalle}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default Historial;