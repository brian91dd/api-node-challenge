const express = require('express');
const articlesController = require('../../controllers/articles.controller');

const router = express.Router();

router
  .route('/')
  .post(articlesController.create)
  .get(articlesController.list);

router
  .route('/:id')
  .put(articlesController.edit)
  .delete(articlesController.deleteArticle);

module.exports = router;
