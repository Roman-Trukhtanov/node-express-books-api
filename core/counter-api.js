const axios = require('axios');

const COUNTER_API_HOST = process.env.COUNTER_API_HOST || 'localhost';
const COUNTER_API_PORT = process.env.COUNTER_API_PORT || 6379;

const StatusNumber = {
  SUCCESSFUL: 200,
  REDIRECT: 300,
};

const UrlPath = {
  COUNTER: `counter`,
};

class CounterAPI {
  constructor({ host, port }) {
    this._host = host;
    this._port = port;
  }
  get(bookID = '') {
    const url = `http://${this._host}:${this._port}/${UrlPath.COUNTER}/${bookID}`;

    return axios
      .get(url)
      .then((res) => {
        if (
          res.statusCode < StatusNumber.SUCCESSFUL ||
          res.statusCode >= StatusNumber.REDIRECT
        ) {
          return new Error('STATUS_CODE = ' + res.statusCode);
        }

        return res.data;
      })
      .catch((err) => {
        return new Error(err);
      });
  }
  post(bookID = '') {
    const url = `http://${this._host}:${this._port}/${UrlPath.COUNTER}/${bookID}/incr`;
   
    return axios
      .post(url)
      .then((res) => {
        if (
          res.statusCode < StatusNumber.SUCCESSFUL ||
          res.statusCode >= StatusNumber.REDIRECT
        ) {
          return new Error('STATUS_CODE = ' + res.statusCode);
        }

        return res.data;
      })
      .catch((err) => {
        return new Error(err);
      });
  }
}

module.exports = new CounterAPI({
  host: COUNTER_API_HOST,
  port: COUNTER_API_PORT,
});
