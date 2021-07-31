const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const loggerMiddleware = require('./src/middleware/logger');
const errorMiddleware = require('./src/middleware/error');

const indexRouter = require('./src/routes/index');
const booksRouter = require('./src/routes/books');
const userRouter = require('./src/routes/user');
const booksApiRouter = require('./src/routes/api/books');
const userApiRouter = require('./src/routes/api/user');

const app = express();


const REDIS_URL = process.env.REDIS_URL || 'localhost';

const redisClient = redis.createClient(REDIS_URL);

const server = http.Server(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(loggerMiddleware);

require('./src/core/passport')(passport);

// Express session
app.use(
  session({
    secret: 'books_secret',
    key: 'sid',
    store: new RedisStore({ client: redisClient }),
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null,
    },
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  next();
});

app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'));
app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/api/user', userApiRouter);
app.use('/api/books', booksApiRouter);

app.use(errorMiddleware);

const { BookRoom } = require('./src/models');
require('./src/core/socket')(io, BookRoom, '/books');

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

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();

