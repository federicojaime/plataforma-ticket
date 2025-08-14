import { initalState, options } from "./mpconstants";

const reducer = (state, action) => {
	if(action.type) {
		switch(action.type) {
			case options.MP_RESET:
				return(initalState);
			case options.MP_SET_CANTIDAD:
				return({ ...state, itemSelected: { ...state.itemSelected, cantidad: parseInt(action.payload, 10) }});
			case options.MP_SET_ITEM_SELECTED:
				return({ ...state, itemSelected: action.payload });
			default:
				console.error(`La accción [type]: ${action.type} no se reconoce como acción válida, se devuelve el estado sin cambios`);
		};
	} else {
		console.error(`No se especifico el tipo de accción [type], se devuelve el estado sin cambios`);
	}
	return state;
};

export default reducer;