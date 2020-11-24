const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: String,
  text: String,
  tags: [String],
});

articleSchema.method({
  toJSON() {
    const jsonResult = {};
    const fields = ['_id', 'title', 'text', 'tags', 'userId'];

    fields.forEach((field) => {
      jsonResult[field] = this[field];
    });

    return jsonResult;
  },
});

module.exports = mongoose.model('Article', articleSchema);
