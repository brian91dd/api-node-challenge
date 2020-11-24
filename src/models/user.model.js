const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: String,
});

userSchema.method({
  toJSON() {
    const jsonResult = {};
    const fields = ['_id', 'name', 'avatar'];

    fields.forEach((field) => {
      jsonResult[field] = this[field];
    });

    return jsonResult;
  },
});

module.exports = mongoose.model('User', userSchema);
