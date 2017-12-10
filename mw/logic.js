const compose = require('compose-middleware').compose;

module.exports = new class LogicMiddleware {

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

  ifTrueInReq(reqVarName, mwArr) {
    return (req, res, next) => {
      if (req[reqVarName] === true) {
        const mwComposed = compose(mwArr);
        mwComposed(req, res, next);
      } else {
        next();
      }
    };
  }
}
