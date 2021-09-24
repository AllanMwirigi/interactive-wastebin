
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config('../.env');

const User = require('../models/User');

const saltRounds = 10; // number of salting rounds for bcrypt password hash

const signup = (req, res, next) => {
  const { email, username, password } = req.body; // user attributes from request body

  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      // new user details
      const user = new User({
        email,
        username,
        password: hash
      });
      // attempt to save user in database
      user
        .save()
        // response returned after successfully saving user in database
        .then(() => res.status(201).json({ code: 201, message: 'user successfully created' }))
        .catch((err) => {
          // in case of any error when saving user in database
          // we channel the error to the error handler in app.js
          next(err);
        });
    })
    .catch((error) => {
      // if an error is encountered hashing the password
      // we channel the error to the error handler in app.js
      next(error);
    });
};


const login = (req, res, next) => {
  User
    .findOne({ email: req.body.email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      // if user is not found
      if (!user) {
        return res
          .status(401)
          .json({
            coed: 401,
            message: 'user not found'
          });
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // if compare returns false
          // it implies provided password is incorrect
          if (!valid) {
            return res
              .status(401)
              .json({
                code: 401,
                message: 'incorrect password'
              });
          }

          // else if compare returns true
          // create a jwt token and send response
          // eslint-disable-next-line no-underscore-dangle
          const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
          return res
            .status(200)
            .json({
              code: 200,
              message: 'login successful',
              // eslint-disable-next-line no-underscore-dangle
              id: user._id,
              username: user.username,
              token
            });
        })
        .catch((err) => {
          next(err); // channel errors to logger in app.js
        });
    })
    .catch((error) => {
      next(error); // channel error to logger in  app.js
    });
};

const updateUser = (req, res, next) => {
  let user = new User({ _id: req.params.id }); // instantiate user with corresponding user _id

  bcrypt
    .hash(req.body.password, saltRounds)
    .then((hash) => {
      user = {
        _id: req.params.id,
        email: req.body.email,
        username: req.body.email,
        password: hash
      }; // updated user attributes

      User
        .updateOne({ _id: req.params.id }, user)
        .then(() => res
          .status(201)
          .json({
            message: 'user successfully updated',
            code: 201
          }))
        .catch((err) => {
          next(err); // channel error to error handler
        });
    })
    .catch((error) => {
      next(error); // channel error to error handler
    });
};

const deleteUser = (req, res, next) => {
  User
    .deleteOne({ _id: req.params.id })
    .then(() => res
      .status(201)
      .json({
        message: 'user successfully deleted',
        code: 201
      }))
    .catch((error) => {
      next(error); // channel error to error handler in app.js
    });
};

module.exports = {
  signup,
  login,
  updateUser,
  deleteUser
};
