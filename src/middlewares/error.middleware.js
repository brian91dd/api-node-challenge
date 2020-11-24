const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
const handler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  if (process.env.NODE_ENV !== 'development') {
    return res.status(500).send('Internal server error');
  }

  return res.json({
    message: err.message,
  });
};

module.exports = {
  handler,
};
