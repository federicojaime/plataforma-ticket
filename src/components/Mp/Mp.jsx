import { useEffect } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { VITE_MP_PUBLIC_KEY } from "../../../config";
import useMpContext from "./storemp/useMpContext";

const Mp = ({ idPreferencia }) => {
	const { state } = useMpContext();

	useEffect(() => {
		initMercadoPago(VITE_MP_PUBLIC_KEY, { locale: "es-AR" });
	}, []);

	if(!idPreferencia) return null;

	return (
		<div className="Mp">
			<Wallet initialization={{ preferenceId: idPreferencia }} customization={{ texts:{ valueProp: "smart_option"}}} />
		</div>
	);
};

export default Mp;