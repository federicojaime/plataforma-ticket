import { useContext } from "react";
import MpContext from "./MpContext";
import { options } from "./mpconstants";

const useMpContext = () => {
	const c = useContext(MpContext);
	if (!c) {
        throw new Error("useMpContext debe ser usado dentro de un StoreProvider");
    }
	const { state, dispatch } = c;
	return { state, dispatch, options };
};

export default useMpContext;