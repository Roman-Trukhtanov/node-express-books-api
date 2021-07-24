const uidGenerator = require('node-unique-id-generator');

const { Schema, model } = require('mongoose');

const todoSchema = new Schema({
  id: {
    type: String,
    unique: true,
    default: uidGenerator.generateUniqueId(),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  authors: {
    type: String,
    default: '',
  },
  favorite: {
    type: String,
    default: '',
  },
  fileCover: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    default: '',
  },
  fileBook: {
    type: String,
    default: '',
  },
});

module.exports = model('Book', todoSchema);
