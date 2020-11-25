const fs = require('fs');
const UserModel = require('../models/user.model.js');
const ApiError = require('../utils/ApiError');

const list = async (req, res) => {
  const users = await UserModel.find({});
  res.json(users);
};

const create = async (req, res, next) => {
  const {
    name,
  } = req.body;

  try {
    const nameExists = await UserModel.findOne({ name });
    if (nameExists) {
      if (req.file) fs.unlinkSync(req.file.path);
      throw new ApiError({
        message: 'Username already exists',
        status: 409,
      });
    }

    const user = new UserModel({
      name,
      avatar: req.file ? req.file.filename : undefined,
    });

    user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  create,
};
