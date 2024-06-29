const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const softDelete = require('../helpers/softDelete');
const dbFields = require('../helpers/dbFields');
const mongooseHistory = require('../helpers/mongooseHistory');
const { intersection } = require('lodash');
const User = require('./user');

const { Schema } = mongoose;

const schema = Schema(
  {
    date: {
      type: Date,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    in: {
      type: Boolean,
      required: true
    },
    id_user: {
      type: Number,
      required: true,
    }

  },
  {
    timestamps: true
  }
);
schema.plugin(softDelete);

schema.pre('save', async function (next) {
  try {
    const user = await User.findOne({ email: this.email_user });
    if (!user) {
      return next(new Error('User non trovata'));
    }

    if (!this.date || isNaN(Date.parse(this.date))) {
      return next(new Error('Data non valida'));
    }

    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.models.Diary || mongoose.model('Diary', schema);
