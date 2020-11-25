const { Types: { ObjectId } } = require('mongoose');
const { WebClient } = require('@slack/web-api');
const ArticleModel = require('../models/article.model.js');
const ApiError = require('../utils/ApiError');

const slackClient = new WebClient(process.env.SLACK_TOKEN);

const list = async (req, res, next) => {
  try {
    const query = { ...req.query };

    if (req.query.tags) {
      query.tags = Array.isArray(req.query.tags) ? { $in: req.query.tags } : req.query.tags;
    }

    const articles = await ArticleModel
      .find(query)
      .populate({
        path: 'userId',
      });

    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
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

    await slackClient.chat.postMessage({
      channel: '#general',
      text: article.title,
    });

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
  list,
};
