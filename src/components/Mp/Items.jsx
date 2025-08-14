import { useEffect, useState } from "react";
import useMpContext from "./storemp/useMpContext";
import { VITE_BACK_END_URL } from "../../../config";

const Items = () => {
    const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const { state, dispatch, options } = useMpContext();

    useEffect(() => {
		const getItems = async () => {
			try {
				const response = await fetch(`${VITE_BACK_END_URL}mp/items`);
				if(response.ok) {
					const responseItems = await response.json();
					setItems(responseItems.data);
					dispatch({ type: options.MP_SET_ITEM_SELECTED, payload: responseItems.data[0] });
				}
			} catch(error) {
				console.error(error);
			}
		};
		getItems().finally(setLoading(false));
	}, []);

	const handleItemSelectedChange = (e) => {
		const filtro = items.filter(i => parseInt(i.id, 10) === parseInt(e.target.value, 10));
		dispatch({ type: options.MP_SET_ITEM_SELECTED, payload: filtro[0] });
	};

	if(loading || !state?.itemSelected.id) return <div>Loading...</div>;

    return(
		<div className="Items min-w-96 p-2 flex flex-col gap-1">
			<label htmlFor="items">Item</label>
			<select className="w-full p-2 border-2 rounded" name="items" id="items" value={state.itemSelected.id} onChange={handleItemSelectedChange}>
				{
					items.map(i => <option key={i.id} value={i.id}>{i.titulo} [{i.precio}]</option>)
				}
			</select>
		</div>
    );
};

export default Items;