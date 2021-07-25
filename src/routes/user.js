const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const uidGenerator = require('node-unique-id-generator');
const {
  ensureAuthenticated,
  forwardAuthenticated,
} = require('../core/auth-helpers');

const SALT_LENGTH = 10;

const getHashedPassword = async (password) => {
  if (!password) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(SALT_LENGTH);
    const hashedPassword = await bcrypt.hash(password, salt); 
  
    return hashedPassword;
  } catch (err) {
    console.error(err);
  }
};

const createDefaultUser = async () => {
  try {
    const adminUser = await User.findOne({
      email: 'admin@gmail.com',
    });

    if (adminUser) {
      return;
    }
    
    const user = {
      id: uidGenerator.generateUniqueId(),
      username: 'admin',
      password: 'admin_123_swd',
      email: 'admin@gmail.com',
    };
  
    user.password = await getHashedPassword(user.password);
  
    User.create(user, (err) => {
      if (err) {
        console.error(err);
      }
    });
  } catch(err) {
    console.error(err);
  }
};

createDefaultUser();

router.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/user/me');
});

router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('user/login', {
    title: 'User | login',
  });
});

router.get('/signup', forwardAuthenticated, (req, res) => {
  res.render('user/signup', {
    title: 'User | signup',
  });
});

router.get('/me', ensureAuthenticated, (req, res) => {
  res.render('user/me', {
    title: 'User panel',
    user: req.user,
  });
});

const checkUserFields = (username, email, password, password2) => {
  const errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Пожалуйста заполните все поля!' });
  }

  if (password != password2) {
    errors.push({ msg: 'Пароли не совпадают' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Пароль должен содержать не меннее 6 символов!' });
  }

  return errors;
};

// SignUp
router.post('/signup', async (req, res) => {
  const { username, email, password, password2 } = req.body;

  const userFiledsErrors = checkUserFields(
    username,
    email,
    password,
    password2
  );
  
  if (userFiledsErrors.length > 0) {
    res.render('user/signup', {
      title: 'User | signup',
      errors: userFiledsErrors,
      user: {
        username,
        email,
        password,
        password2,
      },
    });

    return;
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      const errors = [{ msg: 'Такой email уже существует' }];

      res.render('user/signup', {
        title: 'User | signup',
        errors,
        user: {
          username,
          email,
          password,
          password2,
        },
      });

      return;
    }

    const newUser = new User({
      id: uidGenerator.generateUniqueId(),
      username,
      email,
      password,
    });

    const hashedPassword = await getHashedPassword(password);

    newUser.password = hashedPassword;
    await newUser.save();

    res.redirect('/user/login'); 
  } catch (err) {
    console.error(err);
  }
});

// Login
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: true,
  }),
  (req, res) => {
    // console.log('req.user: ', req.user);
    res.redirect('/user/me');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/user/login');
});

module.exports = router;