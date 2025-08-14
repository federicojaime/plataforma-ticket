export const initalState = {
	itemSelected: {
		cantidad: 1,
		id: 1,
		precio: 10000,
		titulo: "Carrera 5k"
	},
	preferencia: null,
	customization: {
		paymentMethods: {
			creditCard: "all",
			debitCard: "all",
			ticket: "all",
			bankTransfer: "all",
			atm: "all",
			onboarding_credits: "all",
			wallet_purchase: "all",
			mercadoPago: "all",
			maxInstallments: 1
		}
	}
};

export const options = {
	MP_RESET: "MP_RESET",
	MP_SET_CANTIDAD: "MP_SET_CANTIDAD",
	MP_SET_ITEM_SELECTED: "MP_SET_ITEM_SELECTED"
};