const path = require('path');
const express = require('express');
const cors = require('cors');

const loggerMiddleware = require('./src/middleware/logger');
const errorMiddleware = require('./src/middleware/error');

const indexRouter = require('./src/routes/index');
const booksRouter = require('./src/routes/books');
const booksApiRouter = require('./src/routes/api/books');
const userApiRouter = require('./src/routes/api/user');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(loggerMiddleware);

app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'));
app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/api/user', userApiRouter);
app.use('/api/books', booksApiRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
