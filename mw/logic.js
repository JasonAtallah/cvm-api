const compose = require('compose-middleware').compose;

const logic = module.exports = new class LogicMiddleware {

  ifNullInReq(reqVarName, ...args) {
    const testFn = function(req) {
      return _.get(req, reqVarName) === null;
    };

    return logic.runMWIfElse(testFn, ...args);
  }

  ifTrueInReq(reqVarName, ...args) {
    const testFn = function(req) {
      return _.get(req, reqVarName) === true;
    };

    return logic.runMWIfElse(testFn, ...args);
  }

  ifTruthyInReq(reqVarName, ...args) {
    const testFn = function(req) {
      return !!_.get(req, reqVarName);
    };

    return logic.runMWIfElse(testFn, ...args);
  }

  runMWIfElse(testFn, mwArrTrue, mwArrFalse) {
    return (req, res, next) => {
      const result = testFn(req);

      if (result === true) {
        const mwComposed = compose(mwArrTrue);
        mwComposed(req, res, next);
      } else {
        if (mwArrFalse !== undefined) {
          const mwComposed = compose(mwArrFalse);
          mwComposed(req, res, next);
        } else {
          next();
        }
      }
    };
  }
}
