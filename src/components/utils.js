import { useState } from "react";

const useForm = (dataDefecto) => {
    const [dataUser, setDataUser] = useState(dataDefecto);

    const cambiarValores = (e) => {
        setDataUser({ ...dataUser, [e.target.name]: e.target.value });
    }

    return [dataUser, cambiarValores]
}

export default useForm;