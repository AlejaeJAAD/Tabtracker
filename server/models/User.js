const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fileURL: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: [true, "firstName not provided "],
  },
  lastName: {
    type: String,
    required: [true, "lastName not provided "],
  },
  nickName: {
    type: String,
    required: [true, "nickName not provided "],
  },
  phone: {
    type: Number,
    required: [true, "phone not provided "],
  },
  city: {
    type: String,
    required: [true, "city not provided "],
  },
  state: {
    type: String,
    required: [true, "state not provided "],
  },
  country: {
    type: String,
    required: [true, "country not provided "],
  },
  birthDate: {
    type: String,
    required: [true, 'birthDate not provided']
  },
  email: {
    type: String,
    unique: [true, "email already exists in database!"],
    lowercase: true,
    trim: true,
    required: [true, "email not provided"],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: '{VALUE} is not a valid email!'
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Normal", "Admin"],
    required: [true, 
      "Please specify user role"
    ]
  },
  created_date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', userSchema)