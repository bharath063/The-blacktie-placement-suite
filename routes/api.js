var express = require('express');
var router = express.Router();
var User = require('../models/user');

var newUser = new User({
  fname: 'Bharath',
  email: 'bharath@bharathbalan.com',
  password: 'password' 
});

/* GET home page. */
router.get('/', function(req, res) {


 User.find({}, function(err, users) {
    if (err) {
        res.render(error);
    }
  if (err) throw err;


  // object of all the users
  console.log("received from mongo : "+users);
  res.json(users);
});
});

router.post('/',function(req,res) { 

    newUser.save(function(err) {
    if (err) throw err;

    console.log('User : '+newUser.fname+' was saved successfully!');
    });

 });


router.put('/',function(req,res) { 

    User.findOneAndUpdate({}, { lname: 'Balan' }, function(err, user) {
        if (err) throw err;

        // we have the updated user returned to us
        console.log(user);
    });
  
 });


router.delete('/',function(req,res) { 

    User.findByIdAndRemove(4, function(err) {
  if (err) throw err;

  // we have deleted the user
  console.log('User deleted!');
});
  
 });

module.exports = router;
