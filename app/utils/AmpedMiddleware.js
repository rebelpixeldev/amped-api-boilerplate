const
  AmpedFeedback   = require('./AmpedFeedback'),
  util    = require('./AmpedUtil');

module.exports = {
  params : () => {
      return (req, res, next) => {
        req.amped = {};
        req.amped.params = util.getParams(req);
        next();
      }
  },
  feedback : (params = {}) => {
    const feedback = new AmpedFeedback(params);

    return (req, res, next) => {
      res.feedback = feedback.onFeedback.bind(feedback, req, res);
      res.feedbackError = feedback.onFeedbackError.bind(feedback, req, res);
      res.feedbackSuccess = feedback.onFeedbackSuccess.bind(feedback, req, res);
      next();
    }
  }
};

