const express = require('express');
const multer = require('multer');
const path = require('path');
const userController = require('../../controllers/users.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}-${Date.now()}.${file.originalname.split('.').pop()}`);
  },
});

const upload = multer({ storage });
const router = express.Router();

router
  .route('/')
  .get(userController.list)
  .post(upload.single('avatar'), userController.create);

module.exports = router;
