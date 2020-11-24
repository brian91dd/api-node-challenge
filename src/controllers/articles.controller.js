const { Types: { ObjectId } } = require('mongoose');
const ArticleModel = require('../models/article.model.js');
const ApiError = require('../utils/ApiError');

const create = (req, res, next) => {
  const {
    title, text, userId, tags,
  } = req.body;

  try {
    if (!userId && !ObjectId.isValid(userId)) {
      throw new ApiError({
        message: 'userId is required',
        status: 200,
      });
    }

    const article = new ArticleModel({
      title, text, userId, tags,
    });

    article.save();
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
};
