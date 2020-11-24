const express = require('express');
const userRoutes = require('./users.route');

const router = express.Router();

router.use('/users', userRoutes);

module.exports = router;
