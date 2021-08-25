
const inicialState = {
    name: null,
    email: null,
    senha: null,
    token: null,
    system_user_id:null,
    system_unit_id:null
}

const reducer = (state = inicialState, action) => {
    switch(action.type) {
        case 'USER_LOGGED_IN':
            return{
                ...state,
                name: action.payload[0],
                email: action.payload[1],
                senha: action.payload[2],
                token: action.payload[3],
                system_user_id:action.payload[4],
                system_unit_id:action.payload[5]
            }
        case 'USER_LOGGED_OUT':
            return {
                ...state,
                name:null,
                email:null,
                senha: null,
                token:null,
                system_user_id:null,
                system_unit_id:null
            }     
        default: 
        return state                   
    }
}

export default reducer;