

module.exports = {

  performActionFollowup(req, res, next) {
    req.action.perform(req, res, next);
  }

}
