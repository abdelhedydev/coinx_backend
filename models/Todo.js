const mongoose = require('mongoose')
const todoSchema = new mongoose.Schema({
  tile: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})
module.exports = mongoose.model('todo', todoSchema)
