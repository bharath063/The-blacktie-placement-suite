
/*
   Block code needs to be removed
*/

var app = new angular.module('blacktie', ['ui.router','ngResource','ui.bootstrap','ngAnimate']);


// Dummy data

// Dummy data End

/*

    Block of code that needs to be removed

*/

/* Configuring student states */

app.config(function($stateProvider,$urlRouterProvider){

$urlRouterProvider.otherwise('/home');

    $stateProvider.state('StudentHome',{
        url : '/home',
        templateUrl : '/partials/student-home-tabs.html',
        controller : 'StudentTabCtrl'


    });


    $stateProvider.state('StudentEditProfile',{
        url : '/edit?user',
        templateUrl : '/partials/update-student-profile-modal.html',
        controller : 'UpdateStudentProfileCtrl',
    

    });
    $stateProvider.state('ViewNotification',{
        url : '/notification?id',
        templateUrl : '/partials/notifications-modal.html',
        controller : 'ViewNotificationCtrl'
    

    });


})


/* Configuring student states end */



app.controller('StudentHomeCtrl', ['$scope', function($scope){

    console.log("StudentHomeCtrl invoked");

    // replace dummy user data from $resource
   this.user = {
    'username' : '12bcs013',
    'fname' : 'Bharath',
    'lname' : 'B',
    'role' : 'student',
    'phone' : '9843317653',
    'local':{
        'email' : 'bharath18aug@gmail.com'
    },
    'department' : 'CSE',
    'cgpa' : '7.5',
    'backlogs' : '0',
    'avatar' : '/images/12bcs013.jpg'

};

   //end  studentHomeCtrl

    this.isLoggedIn = function(){
        return true;
    }

    var editStudentProfile = function(user){
        console.log("Triggered editStudent")

    }








}]);






app.controller('StudentTabCtrl', function($scope){

    console.log("StudentTabCtrl invoked");

    
});

app.controller('MessagesCtrl', function($scope){

    console.log("MessageCtrl invoked");


    this.unreadMessages = [
        {
            "id": 1,
            "subject": "Shortlisted for mindtree",
            "from": "Mindtree HR",
            "timestamp": "20-02-2016",
            "body": "Congratulations for being shortlisted for a personal interview for mindtree"
        }, {
            "id": 2,
            "subject": "Shortlisted for Skava",
            "from": "Skava HR",
            "timestamp": "20-02-2016",
            "body": "Congratulations for being shortlisted for a personal interview for Skava"
        }, {
            "id": 3,
            "subject": "Password reset request",
            "from": "Admin",
            "timestamp": "18-02-2016",
            "body": "Your password reset was successful"
        }];
        

    
});




app.controller('NotificationsCtrl', function($scope){

    console.log("NotificationsCtrl invoked");


    this.unreadNotifications = [{
            "id": 1,
            "title": "Job invitation from Skava",
            "timestamp": "20-02-2016",
            "body": "You have been invited to take a test for skava"
        }, {
            "id": 2,
            "title": "Job invitation from TCS",
            "timestamp": "20-02-2016",
            "body": "You have been invited to take a test for TCS"
        }, {
            "id": 3,
            "title": "Exam reminder",
            "timestamp": "20-02-2016 2 P.M",
            "body": "The assessment for Infosys is underway right now"
        }, {
            "id": 4,
            "title": "Job invitation from Mindtree",
            "timestamp": "20-02-2016",
            "body": "You have been invited to take a test for Mindtree"
        }, {
            "id": 6,
            "title": "Job invitation from Moris",
            "timestamp": "20-02-2016",
            "body": "You have been invited to take a test for Mindtree"
        }
    ];

    
});


app.controller('ViewNotificationCtrl', function($scope){

    console.log("ViewNotificationCtrl invoked");


   
   console.log($scope);


    
});



app.controller('UpdateStudentProfileCtrl',  function($scope,$window,$stateParams,$state){

    console.log("UpdateStudentProfileCtrl invoked");

    this.user = $stateParams.user;

    console.log($stateParams.user);

    $scope.update = function(){
         

        $state.go('StudentHome');
    };

    $scope.cancel = function(){
        $state.go('StudentHome');
    };


    
});



