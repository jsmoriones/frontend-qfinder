import {createContext, useReducer, useEffect} from 'react';
import {produce} from 'immer';

const ContextPaciente = createContext();

const initialState = {
	paciente: { }
}

const ActionPaciente = produce((state, action) => {
	switch(action.type){
    case "AGREGAR_PACIENTE":
			return state
			break;
		case "VER_PACIENTE":
			return state
			break;
		default:
			return state;
			break;
	}
})

const StatePaciente = ({children}) => {
	const [state, dispatch] = useReducer(ActionPaciente, initialState);

	const getPaciente = (id) => {
		dispatch({
			type: "VER_PACIENTE",
			payload: id
		});
	}

	const agregarPaciente = (data) => {
		dispatch({
			type: "AGREGAR_PACIENTE",
			payload: data
		})
	}

	return(
		<ContextPaciente.Provider
			value={{
				paciente: state.paciente,
				getPaciente,
				agregarPaciente
			}}
		>
			{children}
		</ContextPaciente.Provider>
	)
}

export {ContextPaciente};
export default StatePaciente;