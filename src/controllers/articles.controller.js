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

const edit = async (req, res, next) => {
  const {
    title, text, userId, tags,
  } = req.body;

  const { id } = req.params;

  try {
    const article = await ArticleModel.findOne({ _id: ObjectId(id) });
    if (userId !== article.userId.toString()) {
      throw new ApiError({
        message: 'Can\'t edit article from different user',
        status: 403,
      });
    }

    article.overwrite({
      title, text, tags, userId,
    });

    await article.save();

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  const { id } = req.params;

  try {
    const article = await ArticleModel.findOne({ _id: ObjectId(id) });

    if (!article) {
      throw new ApiError({
        message: 'Article doesn\'t exist',
        status: 403,
      });
    }

    await article.remove();

    res.status(201).json({ _id: id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  edit,
  deleteArticle,
};
