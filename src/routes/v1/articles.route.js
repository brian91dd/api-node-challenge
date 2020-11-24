const express = require('express');
const articlesController = require('../../controllers/articles.controller');

const router = express.Router();

router
  .route('/')
  .post(articlesController.create);

router
  .route('/:id')
  .put(articlesController.edit);

module.exports = router;
