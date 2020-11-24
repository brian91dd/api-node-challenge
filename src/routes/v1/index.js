const express = require('express');
const userRoutes = require('./users.route');
const articlesRoutes = require('./articles.route');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/articles', articlesRoutes);

module.exports = router;
