const express = require('express');
const articlesController = require('../../controllers/articles.controller');

const router = express.Router();

router
  .route('/')
  .post(articlesController.create);

module.exports = router;
