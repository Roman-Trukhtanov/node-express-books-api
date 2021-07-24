const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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
const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || 'qwerty123456';
const NameDB = process.env.DB_NAME || 'books_db';
const HostDb = process.env.DB_HOST || 'mongodb://localhost:27017/';

const INIT_WITH_ATLAS = process.env.ATLAS_DB || false;

async function start() {
  try {
    if (INIT_WITH_ATLAS) {
      await mongoose.connect(HostDb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
      await mongoose.connect(HostDb, {
        user: UserDB,
        pass: PasswordDB,
        dbName: NameDB,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();

