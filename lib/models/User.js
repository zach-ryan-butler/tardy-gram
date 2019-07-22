const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String, 
    require: true
  },
  profilePhotoUrl: String
});

userSchema.virtual('password').set(function(clearPassword) {
  this.passwordHash = bcrypt.hashSync(clearPassword);
});

userSchema.methods.compare = function(clearPassword) {
  return bcrypt.compareSync(clearPassword, this.passwordHash);
}

userSchema.methods.authToken = function() {
  const token = jwt.sign(this.toJSON(), 'MY_SECRET', { expiresIn: '24h' });
  return token;
}

userSchema.statics.findByToken = function(token) {
  const payload = jwt.verify(token, 'MY_SECRET')
  return this
    .findOne({ username: payload.username });
}

module.exports = mongoose.model('User', userSchema);
