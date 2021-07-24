const counterApi = require('./api');

const StatusNumber = {
  SUCCESSFUL: 200,
  REDIRECT: 300,
};

const UrlPath = {
  COUNTER: `counter`,
};

class CounterAPI {
  get(bookID = '') {
    const url = `/${UrlPath.COUNTER}/${bookID}`;

    return counterApi
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
    const url = `/${UrlPath.COUNTER}/${bookID}/incr`;

    return counterApi
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

module.exports = new CounterAPI();
