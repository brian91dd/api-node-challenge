const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
const handler = (req, res, next) => {
  if (!req.headers.authorization || req.headers.authorization !== process.env.ACCESS_TOKEN) {
    throw new ApiError({
      status: 403,
      message: 'Authorization error',
    });
  }

  next();
};

module.exports = {
  handler,
};
