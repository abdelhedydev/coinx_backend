const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String
  },
  todos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Todo'
  }
})
module.exports = mongoose.model('User', userSchema)
