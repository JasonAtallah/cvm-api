const jwt = require('jsonwebtoken');
const config = require('../config');

const parseOptions = {
  algorithms: [config.jwt.algorithm],
  ignoreExpiration: false
};

module.exports = new class JWTService {

  parse (token) {
    return new Promise((res, rej) => {
      try {
        jwt.verify(token, config.jwt.secret, parseOptions, function (err, payload) {
          if (err) {
            rej(err);
          } else {
            res(payload);
          }
        });
      } catch (err) {
        rej(err);
      }
    });
  }

  generate (payload) {
    return jwt.sign(payload, config.jwt.secret, {
      algorithm: config.jwt.algorithm,
      audience: config.jwt.audience,
      expiresIn: config.jwt.expiresIn
    });
  }
};
