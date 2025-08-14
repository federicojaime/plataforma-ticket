import { initMercadoPago, StatusScreen} from "@mercadopago/sdk-react";
import { VITE_MP_PUBLIC_KEY } from "../../config";

const Estado = ({ paymentId }) => {
    useEffect(() => {
		initMercadoPago(VITE_MP_PUBLIC_KEY, { locale: "es-AR" });
	}, []);

    return(
        <div className="Estado">
            <StatusScreen
				initialization={ ({ paymentId: paymentId }) }
				onReady={() => console.log("OnreadydeStatus")}
				onError={(error) => console.error(error)}
			/>
        </div>
    );
};

export default Estado;