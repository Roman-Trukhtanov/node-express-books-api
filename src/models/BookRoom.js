const { Schema, model } = require('mongoose');

const bookrRomSchema = new Schema({
  roomName: String,
  messages: [
    {
      username: String,
      text: String,
      msgType: String,
    },
  ],
});

module.exports = model('BookRoom', bookrRomSchema);
