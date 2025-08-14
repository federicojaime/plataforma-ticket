import { useEffect, useState } from "react";
import { initMercadoPago, Payment/*, Wallet*/, StatusScreen  } from "@mercadopago/sdk-react";
import { VITE_MP_PUBLIC_KEY, VITE_BACK_END_URL } from "../../../config";
import useMpContext from "./storemp/useMpContext";
import { useAuth } from "../../context/AuthContext";

const Mp = ({ idIncripto }) => {
	const { user } = useAuth(); // Usa el hook useAuth para obtener la información del usuario
	const { state } = useMpContext();
	const [idpago, setIdPago] = useState(null);

	useEffect(() => {
		initMercadoPago(VITE_MP_PUBLIC_KEY, { locale: "es-AR" });
	}, []);

	const onSubmit = async ({ selectedPaymentMethod, formData }) => {
		setIdPago(null);

		try {
			const datasend = {
				formData: formData,
				user: {
					id: idIncripto,
					idItem: state.itemSelected.id
				}
			};
			console.log("Inicio envío al backend!");
			const response = await fetch(`${VITE_BACK_END_URL}mp/procesar/pago`, {
				method: "POST",
				headers: {
					'Authorization': user.jwt,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(datasend)
			});
			const responseJson = await response.json();
	
			console.log(responseJson);
	
			if(responseJson.ok) {
				setIdPago(responseJson.dataMp.id);
				alert("Ok proceso!");
			} else {
				alert("Error?");
			}
		} catch (error) {
			alert("Error!")
			console.log(error);
		}
	};

	const onError = async (error) => {
		// callback llamado para todos los casos de error de Brick
		console.log(error);
	};

	const onReady = async () => {
		console.log("onReady?");
		/*
		Callback llamado cuando el Brick está listo.
		Aquí puede ocultar cargamentos de su sitio, por ejemplo.
		*/
	};
	if (!idIncripto) { return null }
	if (!state.itemSelected.id || (parseInt(state.itemSelected.id, 10) === 0)) return <div>Loading...</div>;

	return (
		<div className="Mp">
			{/* <Wallet initialization={{ preferenceId: "57883365-67396ec5-edfe-43fe-90b6-0eff2270ed4e" }} customization={{ texts:{ valueProp: "smart_option"}}} /> */}
			{
				idpago ?
				<StatusScreen
					initialization={({ paymentId: idpago })}
					onReady={() => console.log("OnreadydeStatus")}
					onError={(error) => console.error(error)}
				/>
				:
				<Payment
					initialization={({
						amount: (parseInt(state.itemSelected.cantidad, 10) * parseFloat(state.itemSelected.precio, 10)),
						preferenceId: state.itemSelected.idmp,
					})}
					customization={state.customization}
					onSubmit={onSubmit}
					onReady={onReady}
					onError={onError}
				/>
			}
		</div>
	);
};

export default Mp;