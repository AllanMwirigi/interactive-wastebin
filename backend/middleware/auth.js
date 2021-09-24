const jwt = require('jsonwebtoken');
require('dotenv').config('../.env');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization; // extract authorization header
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET); // decrypt token
    const { id } = decodeToken; // extract payload data from decodedToken
    // look for userid in either params or headers, if not found then unauthorize
    if (req.params.id !== id && req.headers.userid !== id) {
      return res
        .status(401)
        .json({
          code: 401,
          message: 'unauthorized'
        });
    }
    next(); // continue execution if user id matches id in token
  } catch (error) {
    next(error); // channel errors to logger & handler in app.js
  }
};
