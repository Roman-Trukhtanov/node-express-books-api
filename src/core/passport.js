const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('../models');

const verify = async (email, password, done) => {
  try {
    // Match user
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return done(null, false, {
        message: 'Пользователь по такому email не зарегистрирован!',
      });
    }

    // Match password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
      }

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Некорректный пароль!' });
      }
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = (passport) => {
  passport.use('local', new LocalStrategy({ usernameField: 'email' }, verify));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({ id }, function (err, user) {
      done(err, user);
    });
  });
};
