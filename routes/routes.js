// app/routes.js

var mongoose = require('mongoose');
var configDB = require('../config/database.js');
var User = require('../models/user');
// mongoose.connect(configDB.url); // connect to our database




var TWILIO_ACCOUNT_SID = "AC8386aa08d27e801802bbc093b005651b";
var TWILIO_AUTH_TOKEN = "3457a4a024b19c11904a6cdc8494dff6";
var TWILIO_PHONE = '+12018491937';


module.exports = function (app, passport) {

    var jwt = require('express-jwt');
    // var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

    var auth = jwt({
        secret: 'SECRET',
        requestProperty: 'payload'
    });





    app.post('/register', function (req, res, next) {
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


        user.save(function (err) {
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

    app.post('/login', function (req, res, next) {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                message: 'Please fill out all fields'
            });
        }

        passport.authenticate('local', function (err, user, info) {
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

    app.get('/', function (req, res) {

        // render the page and pass in any flash data if it exists
        console.log("Sending index.ejs");
        // res.end('home');
        res.render('index.ejs', {
            message: req.flash('loginMessage')
        });

    });
    app.get('/api/users/:username', auth, function (req, res, next) {
        console.log('An authorised user "' + req.payload.username + '" with role "' + req.payload.role + '" requested /api/users ');
        if (!req.payload.role === 'admin')
            res.json({
                "error": "You do not have sufficient permission"
            });


        console.log("Requested user : " + req.params.username);

        User.find({
            username: req.params.username
        }, function (err, users) {
            if (err) {
                console.log('error from db' + err);
                return next(err);
            }
            users = users[0];

            res.json(users);
        });

    });
    app.get('/api/users', auth, function (req, res, next) {
        console.log('An authorised user "' + req.payload.username + '" with role "' + req.payload.role + '" requested /api/users ');
        //if (!req.payload.role === 'admin')
        //    res.json({
        //        "error": "You do not have sufficient permission"
        //    });

        User.find({}, function (err, users) {
            if (err) {
                console.log('error from db' + err);
                return next(err);
            }
            //console.log('sending: '+users);
            res.json(users);
        });

    });

    // Create new user

    app.post('/api/users', auth, function (req, res, next) {

        //if (!req.payload.role === 'admin')
        //    res.json({
        //
        //        "error": "You do not have sufficient permission"
        //    });
        //
        //
        //if (!req.body.username || !req.body.phone) {
        //    return res.status(400).json({
        //        message: 'A username and phone number is required'
        //    });
        //}


        var randomstring = require("randomstring");

        var randomPassword = randomstring.generate({
            length: 8,
            charset: 'alphanumeric'
        });

        var user = new User(req.body);
        console.log('A user object was created');
        // user= req.body;

        user.local.password = user.generateHash(randomPassword);

        console.log("Hash: " + user.local.password);
        console.log("Paswword for '"+user.username+"' is '"+randomPassword+"'");


        var message = 'Hi, ' + user.username + '. Your one use password for Blacktie is: ' + randomPassword + '. Please change it as soon as you login.'

        var TO_PHONE = '+91'+req.body.phone;


        var TWILIO_ACCOUNT_SID = "AC8386aa08d27e801802bbc093b005651b";
        var TWILIO_AUTH_TOKEN = "3457a4a024b19c11904a6cdc8494dff6";
        var TWILIO_PHONE = '+12018491937';

        var twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


        twilio.sendMessage({

            to: TO_PHONE,
            from: TWILIO_PHONE,
            body: message
        }, function (err, responseData) {

            if (!err) {

                console.log(responseData.from);
                console.log(responseData.body);

                console.log('Sent an sms to: '+TO_PHONE);

                 user.local.password = user.generateHash(randomPassword);


                user.save(function (err) {
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

    app.put('/api/users/:_id', auth, function (req, res, next) {

        //if (!req.payload.role === 'admin')
        //    res.json({
        //        "error": "You do not have sufficient permission"
        //    });
        //


        //req.files=[{
        //    fieldname:'profilePic'
        //},{
        //    fieldname:'resume'
        //}];


        var files = req.files;
        console.log(files);
        if(files){


            req.body = JSON.parse(req.body.item);

            if(!(JSON.stringify(files) === JSON.stringify({}))){

                console.log("Received some Files");

                if(files.profilePic){
                    console.log(" --> Received a Profile picture");
                    req.body['profilePic']=files.profilePic[0].filename;
                }


                if(files.resume){
                    console.log(" --> Received a Resumé");
                    req.body['resume']=files.resume[0].filename;
                }

                console.log(req.body);

            }



        };






        delete req.body["_id"];


        // res.json({'success' : 'true'});


        User.findOneAndUpdate({
            _id: req.params._id
        }, req.body, function (err, user) {
            if (err) {
                console.log('Error while updating record');
                res.end("Internal error");
            }
            ;
            res.json(user);
        });


    });

    // DELETE an user

    app.delete('/api/users/:_id', auth, function (req, res, next) {

        if (!req.payload.role === 'admin')
            res.json({
                "error": "You do not have sufficient permission"
            });
        console.log("Requested to delete " + req.body._id);

        User.remove({
            _id: req.params._id
        }, function (err, user) {


            if (err) {
                return next(err);
            }

            res.json({
                message: 'Successfully deleted user'
            });

        });

    });

    // Reset Password

    app.put('/api/users/resetPassword/:_id', auth, function (req, res, next) {
        if (!req.payload.role === 'admin')
            res.json({
                "error": "You do not have sufficient permission"
            });

        console.log("Requested to Reset Password for ObjectId: "+req.params._id);


        var randomstring = require("randomstring");

        var randomPassword = randomstring.generate({
            length: 8,
            charset: 'alphanumeric'
        });

        var TO_PHONE = '';
        var newHash='';

        User.findById(req.params._id,function(err, found){

            if(err){
                res.end("Could not find a matching user for ObjectId");
            }

            TO_PHONE =  found.phone;

            newHash = found.generateHash(randomPassword);

            var message = 'Hi, ' + found.username + '. Your new one time password for Blacktie is: ' + randomPassword + '.';



        var twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        twilio.sendMessage({

            to: TO_PHONE,
            from: TWILIO_PHONE,
            body: message
        }, function (err, responseData) {

            if (!err) {

                console.log(responseData.from);
                console.log(responseData.body);

                console.log('Sent a reset password sms to: '+TO_PHONE+' message: '+message);

                User.findOneAndUpdate({
                    _id: req.params._id
                }, {local:{password : newHash} }, function (err, user) {
                    if (err) {
                        console.log('Error while updating record');
                        return next(err);
                    };
                    res.json(user);
                });




            } else {
                console.log('An error occurred' + err);
                return next(err);
            }
        });


        });



    });


    /* End of admin routes */

    /*
     *
     Start of Student routes
     *
     */


    app.get('/api/student/profile', auth, function (req, res, next) {
        console.log('An authorised user "' + req.payload.username + '" with role "' + req.payload.role + '" requested /api/student/profile ');

        console.log('An authorised user "' + req.query.username);
        if (!req.payload.role === 'student' || !req.payload.role === 'hr')
            res.json({
                "error": "You do not have sufficient permission"
            });


        User.findOne({username: req.payload.username}, function (err, doc) {
            doc.notifications.jobId = 'jason borne';
            for (var i = 0; i < doc.notifications.length; i++)
                if (doc.notifications[i][jobId] == thisJobId) {
                    doc.notifications[i].registered = 1;
                    break;
                }

            doc.visits.$inc();
            doc.save();
        });

        //User.findOneAndUpdate({
        //    $and: [{username: req.payload.username}, {jobId: jobId}]
        //
        //}, {
        //    '$set': {
        //        'notifications.$.registered': 1
        //    }
        //}, function (err, user) {
        //    if (err) {
        //        console.log('Error while updating record');
        //        res.end("Internal error");
        //    }
        //    ;
        //
        //    console.log(" Successfully updated user");
        //    res.json(user);
        //
        //
        //});


        Job.findByIdAndUpdate(
            jobId,
            {$push: {"registeredCandidates": {username: req.payload.username}}},
            {safe: true, new: true},
            function (err, data) {
                if (err) {
                    console.log('Error while updating record');
                    res.end("Internal error");
                }
                ;

                res.json(data);
            }
        );


    });


    app.get('/api/student/messages', auth, function (req, res, next) {
        console.log('An authorised user "' + req.payload.username + '" with role "' + req.payload.role + '" requested /api/student/messages ');


        if (!req.payload.role === 'hr')
            res.json({
                "error": "You do not have sufficient permission"
            });

        User.find({username: req.payload.username}, function (err, users) {
            if (err) {
                console.log('error from db' + err);
                return next(err);
            }

            res.json(users);
        });

    });


    /* End of Student routes  */


    /* HR routes BEGIN */

    app.get('/api/hr/profile', auth, function (req, res, next) {
        console.log('An authorised user "' + req.payload.username + '" with role "' + req.payload.role + '" requested /api/hr/profile ');


        if (!req.payload.role === 'hr')
            res.json({
                "error": "You do not have sufficient permission"
            });

        User.find({username: req.payload.username}, function (err, users) {
            if (err) {
                console.log('error from db' + err);
                return next(err);
            }

            res.json(users);
        });

    });


    // CREATE NEW JOB

    app.post('/api/hr/job', auth, function (req, res, next) {

        if (!req.payload.role === 'hr')
            res.json({
                "error": "You do not have sufficient permission"
            });


        /* Perform new test creation validation */

        //if (!req.body.username || !req.body.phone) {
        //    return res.status(400).json({
        //        message: 'A username and phone number is required'
        //    });
        //}


        var test = new Test(req.body);
        console.log('A Test model object was created');


        test.save(function (err) {
            if (err) {
                console.log('An error occured registering user with details : ');
                console.log(req.body);
                return next(err);
            }

            return res.json(test)
        });

        /***********************
         *
         *
         *
         *  Write code here to send invitation for each candidate matching criteria
         *
         *
         */


    });


    app.get('/api/hr/job/:_id', auth, function (req, res, next) {
        console.log('An authorised user "' + req.payload.username + '" with role "' + req.payload.role + '" requested /api/hr/profile ');


        if (!req.payload.role === 'hr')
            res.json({
                "error": "You do not have sufficient permission"
            });

        // Please Require('./models/test.js');
        Test.findOneById(req.params._id, function (err, data) {
            if (err) {
                console.log('error from db' + err);
                return next(err);
            }
            res.json(data);
        });


    });


    app.post('/api/hr/job/:_id/message', auth, function (req, res, next) {

        if (!req.payload.role === 'hr')
            res.json({
                "error": "You do not have sufficient permission"
            });


        /* Perform new test creation validation */

        //if (!req.body.username || !req.body.phone) {
        //    return res.status(400).json({
        //        message: 'A username and phone number is required'
        //    });
        //}

        var candidates = req.body.candidates;

        var message = req.body.message;

        var timestamp = new Date();


        console.log('Sending message to candidates');

        // almost fixed


        candidates.forEach(function (candidate) {

            // Write code to twilio message to each candidate


            User.findAndUpdate(
                {username: candidate},
                {
                    $push: {
                        "messages": {
                            body: messageBody,
                            from: req.payload.fname + " " + req.payload.lname,
                            timestamp: timestamp
                        }
                    }
                },
                {safe: true, new: true},
                function (err, data) {
                    if (err) {
                        console.log('Error while updating record');
                        res.end("Internal error");
                    }

                    res.json(data);


                }
            );


        });


    });


    /* HR routes END */


    /* assessment routes BEGIN */


    // update test details

    app.put('/api/hr/assessment/:_id', auth, function (req, res, next) {



        var files = req.files;
        console.log(files);
        if(files){


            req.body = JSON.parse(req.body.item);

            if(!(JSON.stringify(files) === JSON.stringify({}))){

                console.log("Received some Files");

                if(files.questionCSV){
                    console.log(" --> Received a Resumé");
                    req.body['questions']=files.resume[0].filename;

                    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CSV to JSON here IMPORTANT IMPORTANTIMPORTANT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



                }

                console.log(req.body);

            }


        };

        User.findAndUpdate({
             cgpa:{$gt:req.body.assessments.minCgpa},
            backlogs:{$le : req.body.assessments.maxBacklogs}
        }, req.body, function (err, user) {
            if (err) {
                console.log('Error while updating assessment');
                res.end("Internal error");
            }
            ;
            res.json(user);
        });









        delete req.body["_id"];


        // res.json({'success' : 'true'});


        User.findOneAndUpdate({
            _id: req.params._id
        }, req.body, function (err, user) {
            if (err) {
                console.log('Error while updating assessment');
                res.end("Internal error");
            }
            ;
            res.json(user);
        });


    });


    // NEEDS ATTENTION
    app.get('/api/assessment/:_id/questions', auth, function (req, res, next) {
        console.log('An authorised user "' + req.payload.username + '" with role "' + req.payload.role + '" requested /api/student/messages ');


        if (!req.payload.role === 'student')
            res.json({
                "error": "You do not have sufficient permission"
            });

        Test.findById(req.params._id, function (err, data) {
            if (err) {
                console.log('error from db' + err);
                return next(err);
            }


            //NEED A FIX
            delete data.registeredCandidates;
            delete data.createdBy;

            //send asssessment questions to candidate
            res.json(data);
        });

    });


    app.post('/api/assessment/:_id', auth, function (req, res, next) {
        console.log('An authorised user "' + req.payload.username + '" with role "' + req.payload.role + '" requested /api/student/messages ');


        if (!req.payload.role === 'student')
            res.json({
                "error": "You do not have sufficient permission"
            });


        responses = req.body.responses;

        var questions;
        var score = 0;

        Test.findById(req.params._id, function (err, data) {
            if (err) {
                console.log('error from db' + err);
                return next(err);
            }


            questions = data.questions;


        });

        responses.forEach(function (response) {

            var qid = response.qid;
            answer = response.answer;

            // insert code here to check each question if answer is correct and update score

            for (i = 0; i < questions.length; i++) {

                if (response.qid == questions[i].qid) {
                    if (response.answer == questions[i].answer) {
                        score += 1;
                    }
                    break;

                }

            }


        });


        Test.findById(req.params._id, function (err, data) {
            if (err) {
                console.log('error from db' + err);
                return next(err);
            }

            data.registeredCandidates[req.payload.username].score = score;


            //send asssessment questions to candidate
            res.json({success: "ok"});
        });


    });



    /* assessment routes END */



    // HR send sms


    app.post('/api/hr/message', auth, function (req, res, next) {

        var phoneNumbers=[];


        var message = req.body.message;
        console.log('Message:'+req.body.message);

        //for(var i=0;i<req.body.candidates.length;i++){
        //    phoneNumbers.push(req.body.candidates[i].phone);
        //}

        for(var i=0;i<req.body.phones.length;i++){
            if(req.body.phones[i]!=null){
                phoneNumbers.push(req.body.phones[i].toString());
            }

        }



        console.log(phoneNumbers);


        var twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        for(var i=0;i<phoneNumbers.length;i++){


                var TO_PHONE = '+91'+phoneNumbers[i];


                twilio.sendMessage({
                    to: TO_PHONE,
                    from: TWILIO_PHONE,
                    body: message
                }, function (err, responseData) {

                    if (!err) {

                        console.log("sms sent from:"+responseData.from+"   Body:"+responseData.body);

                    }else {
                        console.log('An error occurred' + err);
                        return next(err);
                    }
                });
            }


                res.end('ok');








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