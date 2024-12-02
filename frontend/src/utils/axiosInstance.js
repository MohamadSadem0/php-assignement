import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost/assignements/php-assignement-test/action/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
