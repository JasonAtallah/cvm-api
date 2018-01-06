module.exports = {

  performActionFollowup(req, res, next) {
    try {
      const actionMW = require(`./threads/actions/${req.action.name}`);
      actionMW(req, res, next);
    } catch (err) {
      console.dir(err);
      next();
    }
  }

}
