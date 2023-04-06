import ACTIONS from "./index";
import task from '../../functions/apiCalls';



// fetching task from API for action
export const fetchTask = async () => {

    try {
        const res = await task.getlistAll();
        return res.data.tasks

    } catch (error) {

        return error
    }


}

// Dispatching 
export const dispatchTask = (res) => {

    console.log("taskAction")
    return {
        type: ACTIONS.GET,
        payload: {
            data: res
        }
    }

}

