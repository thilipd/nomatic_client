import ACTIONS from "../actions";

const intialState = {
    data: [],
}


const taskReducer = (state = intialState, action) => {

    switch (action.type) {
        case ACTIONS.GET:
            return {
                data: action.payload.data
            }

        default:
            return state;
    }
}
export default taskReducer