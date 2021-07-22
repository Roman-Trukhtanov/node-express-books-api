const express = require('express');
const redis = require('redis');
const cors = require('cors');

const REDIS_URL = process.env.REDIS_URL || 'localhost';

const redisClient = redis.createClient(REDIS_URL);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/counter/:bookId', (req, res) => {
  const { bookId } = req.params;

  redisClient.get(bookId, (err, rep = 0) => {
    if (err) {
      res.status(500).json({ err: 'Ошибка redis: ' + err });
    } else if (!rep) {
      res
        .status(500)
        .json({ err: `Счетчик от книги c ID=${bookId} не найден` });
    } else {
      res.json({ bookId, counter: rep});
    }
  });
});

app.post('/counter/:bookId/incr', (req, res) => {
  const { bookId } = req.params;

  redisClient.incr(bookId, (err, rep) => {
    if (err) {
      res.status(500).json({ err: 'Ошибка redis: ' + err });
    } else {
      res.json({ bookId, counter: rep });
    }
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Redis server is running on port ${PORT}`);
});
