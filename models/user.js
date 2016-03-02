var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
// mongoose.connect('mongodb://localhost/blacktie');
var configDB = require('../config/database.js');
var jwt = require('jsonwebtoken');


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
var Schema = mongoose.Schema;
var userSchema = new Schema(
        {
            fname: String,
            lname: String,
            username: String,
            role: {
                type: String,
                enum: ['admin', 'student', 'hr'],
                default: 'student'
            },
            phone: String,
            meta: {
                age: Number,
                website: String
            },
            created_at: Date,
            updated_at: Date,
            local: {
                email: String,
                password: String,
            },
            google: {
                id: String,
                token: String,
                email: String,
                name: String
            }
        }
    );


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    // return true;
    return bcrypt.compareSync(password, this.local.password);
};
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

//generating JWT
userSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    email: this.local.email,
    role: this.role,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};


// finally we export our model
module.exports = mongoose.model('User', userSchema);