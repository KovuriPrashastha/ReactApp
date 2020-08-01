import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-6f72a.firebaseio.com/'
});

export default instance;