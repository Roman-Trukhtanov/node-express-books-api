const axios = require('axios');
const { REQUEST_TIMEOUT } = require('../../../const');

const COUNTER_API_HOST = process.env.COUNTER_API_HOST || 'localhost';

const createCounterAPI = () => {
  const api = axios.create({
    baseURL: COUNTER_API_HOST,
    timeout: REQUEST_TIMEOUT,
  });

  const onSuccess = (response) => {
    return response;
  };

  const onFail = (err) => {
    throw err;
  };

  api.interceptors.response.use(onSuccess, onFail);

  return api;
};

module.exports = createCounterAPI();
