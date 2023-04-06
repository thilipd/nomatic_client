import axios from '../../axios';





const task = {

    create: async (data) => {

        try {
            // sending request to create a task
            const response = await axios.post('/api/v1/task', { ...data });

            return response;

        } catch (error) {
            return error
        }

    },

    getlistAll: async () => {

        try {
            // sending request to get list of task
            const response = await axios.get(`/api/v1/list`);
            return response
        } catch (error) {
            return error
        }
    },

    update: async (id, data) => {
        try {
            // sending request to update a task by id
            const response = await axios.put(`/api/v1/update/${id}`, { ...data });
            return response;

        } catch (error) {
            return error
        }
    },

    delete: async (id) => {
        try {
            // sending request to delete a task by id
            const response = await axios.delete(`/api/v1/delete/${id}`);
            return response;

        } catch (error) {
            return error
        }
    }


}


export default task;