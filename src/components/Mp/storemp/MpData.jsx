import { useReducer } from "react";
import MpContext from "./MpContext";
import { initalState } from "./mpconstants";

import reducer from "./reducer";

const MpData = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initalState);
    
    return(
        <MpContext.Provider value={{ state, dispatch }}>
            { children }
        </MpContext.Provider>
    );
};

export default MpData;