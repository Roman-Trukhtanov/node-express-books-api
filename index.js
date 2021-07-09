const express = require('express');
const cors = require('cors');

const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const booksApiRouter = require('./routes/api/books');
const userApiRouter = require('./routes/api/user');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(loggerMiddleware);

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
