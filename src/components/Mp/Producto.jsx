import useMpContext from "./storemp/useMpContext";

const Producto = () => {
	const { state, dispatch, options } = useMpContext();

	if(!state?.itemSelected.id) return null;

	return(
		<div className="Producto flex flex-col justify-center items-center gap-2">
			<h1 className="text-4xl">{state.itemSelected.titulo}</h1>
			<div className="relative">
				<img className="max-w-md rounded-md shadow-md" src="https://img.freepik.com/fotos-premium/tortuga-marina-nadando-agua-fumando-cigarro-usando_685680-672.jpg" alt="Tortuga" />
				<div className="absolute right-2 bottom-2 p-2 flex justify-end items-center gap-2">
					<select className="p-2 border-2 rounded" name="amount" id="amount" value={state.itemSelected.cantidad} onChange={(e) => dispatch({ type: options.MP_SET_CANTIDAD, payload: parseInt(e.target.value) })}>
						<option value={1}>1</option>
						<option value={2}>2</option>
						<option value={3}>3</option>
						<option value={100}>100</option>
						<option value={1000}>1000</option>
					</select>
					<div className="p-2 border-2 border-pink-800 rounded-md bg-pink-600 text-white bold">$ {(parseInt(state.itemSelected.cantidad, 10) * parseFloat(state.itemSelected.precio, 10))}</div>
				</div>
			</div>
		</div>
	);
};

export default Producto;