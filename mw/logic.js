const compose = require('compose-middleware').compose;

module.exports = {

  ifNullInReq(reqVarName, mwArr) {
    return (req, res, next) => {
      if (!req[reqVarName]) {
        const mwComposed = compose(mwArr);
        mwComposed(req, res, next);
      } else {
        next();
      }
    };
  }
}