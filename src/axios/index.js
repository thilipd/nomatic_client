import axios from 'axios';

// Creating axios instance

const instance = axios.create({
    //baseURL: ' http://localhost:8005',

    baseURL: "https://nomatic-server.onrender.com"

})

export default instance;