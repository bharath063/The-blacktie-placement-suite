// app/routes.js

var mongoose = require('mongoose');
var configDB = require('../config/database.js');
var User = require('../models/user');
// mongoose.connect(configDB.url); // connect to our database


module.exports = function(app, passport) {

    var jwt = require('express-jwt');
    // var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

    var auth = jwt({
        secret: 'SECRET',
        requestProperty: 'payload'
    });




    app.post('/register', function(req, res, next) {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                message: 'A username and password combination is required'
            });
        }



        var user = new User();
        console.log('A user object was created');
        user.username = req.body.username;

        if (req.body.role) {
            user.role = req.body.role;
        }

        user.local.password = user.generateHash(req.body.password);


        user.save(function(err) {
            if (err) {
                console.log('An error occured when registering user with details : ');
                console.log(req.body);
                return next(err);
            }

            return res.json({
                token: user.generateJWT()
            })
        });
    });

    app.post('/login', function(req, res, next) {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                message: 'Please fill out all fields'
            });
        }

        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }

            if (user) {
                return res.json({
                    token: user.generateJWT()
                });
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);
    });

    app.get('/', function(req, res) {

        // render the page and pass in any flash data if it exists
        console.log("Sending index.ejs");
        // res.end('home');
        res.render('index.ejs', {
            message: req.flash('loginMessage')
        });

    });
    app.get('/api/users/:username', auth, function(req, res, next) {
        console.log('An authorised user "' + req.payload.username + '" with role "' + req.payload.role + '" requested /api/users ');
        if (!req.payload.role === 'admin')
            res.json({
                "error": "You do not have sufficient permission"
            });


        console.log("Requested user : " + req.params.username);

        User.find({
            username: req.params.username
        }, function(err, users) {
            if (err) {
                console.log('error from db' + err);
                return next(err);
            }
            users = users[0];

            res.json(users);
        });

    });
    app.get('/api/users', auth, function(req, res, next) {
        console.log('An authorised user "' + req.payload.username + '" with role "' + req.payload.role + '" requested /api/users ');
        if (!req.payload.role === 'admin')
            res.json({
                "error": "You do not have sufficient permission"
            });

        User.find({}, function(err, users) {
            if (err) {
                console.log('error from db' + err);
                return next(err);
            }
            console.log('here too');
            res.json(users);
        });

    });

    // Create new user

    app.post('/api/users', auth, function(req, res, next) {

        if (!req.payload.role === 'admin')
            res.json({
                "error": "You do not have sufficient permission"
            });



        if (!req.body.username || !req.body.phone) {
            return res.status(400).json({
                message: 'A username and phone number is required'
            });
        }


          var randomstring = require("randomstring");

        var randomPassword = randomstring.generate({
            length: 8,
            charset: 'alphanumeric'
        });

        var user = new User(req.body);
        console.log('A user object was created');
        // user= req.body;

        user.local.password = user.generateHash(randomPassword);

        console.log("Hash: "+ user.local.password );


        var message = 'Hi, '+user.username+'. Your one use password for Blacktie is: ' + randomPassword + '. Please change it as soon as you login.'

        var TWILIO_ACCOUNT_SID = "AC7e0a7613299d0f44a831c3ffa4267672";
        var TWILIO_AUTH_TOKEN = "c6cff68edb492b2ba131424a9eaf588b";
        var TWILIO_PHONE = '+17543335959';
        var TO_PHONE = '+919843317653';
        var twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        twilio.sendMessage({

            to: TO_PHONE,
            from: TWILIO_PHONE,
            body: message
        }, function(err, responseData) {

            if (!err) {

                console.log(responseData.from);
                console.log(responseData.body);

                // res.send('Sent an sms to: '+TO_PHONE);
                // user.local.password = user.generateHash(randomPassword);


                user.save(function(err) {
                    if (err) {
                        console.log('An error occured registering user with details : ');
                        console.log(req.body);
                        return next(err);
                    }

                    return res.json(user)
                });


            } else {
                console.log('An error occurred' + err);
                return next(err);
            }
        });






    });


    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Edit an user 

    app.put('/api/users/:_id', auth, function(req, res, next) {

        if (!req.payload.role === 'admin')
            res.json({
                "error": "You do not have sufficient permission"
            });



        delete req.body["_id"];




        // res.json({'success' : 'true'});


        User.findOneAndUpdate({
            _id: req.params._id
        }, req.body, function(err, user) {
            if (err) {
                console.log('Error while updating record');
                res.end("Internal error");
            };
            res.json(user);
        });

    });

    // DELETE an user

    app.delete('/api/users/:_id', auth, function(req, res, next) {

        if (!req.payload.role === 'admin')
            res.json({
                "error": "You do not have sufficient permission"
            });


        User.remove({
            _id: req.params._id
        }, function(err, user) {


            if (err) {
                return next(err);
            }

            res.json({
                message: 'Successfully deleted user'
            });

        });

    });





}; //end exports





// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');

}