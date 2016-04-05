/**
 * Created by bharath on 23/03/16.
 */
app.controller('DashboardCtrl', function ($scope) {

    this.user = {
        'username': '12bcs013',
        'fname': 'Bharath',
        'lname': 'B',
        'role': 'student',
        'phone': 9843317653,
        'local': {
            'email': 'bharath18aug@gmail.com'
        },
        'department': 'CSE',
        'cgpa': '7.18',
        'backlogs': '0',
        'avatar': '/images/12bcs013.jpg'
    };

});

app.controller('EditProfileCtrl', function ($scope,$state) {

    this.user = $scope.$parent.Dashboard.user;

    this.update = function () {
        // code to update profile
        $state.go('dashboard');
    };
    this.reset = function () {
        //code to reset profile
        $state.go('dashboard');
    };

});

app.controller('TabsCtrl', function ($scope) {

});



app.controller('MessagesCtrl', function ($scope) {

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
        "timestamp": "20-02-2016",
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


app.controller('ViewNotificationCtrl', function($scope,$stateParams,$state){



    this.unreadNotifications = [{
        "id": 1,
        "title": "Job invitation from Skava",
        "timestamp": "20-02-2016",
        "body": "You have been invited to take a test for skava",
        assessmentDate : " 27-02-2016 14:00:00"
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

    var filteredNotification = this.unreadNotifications.filter(function(element) {
        return element.id == $stateParams.id;
    });
    if (filteredNotification.length > 0) {
        // we have found a corresponding element
         this.notification = filteredNotification[0];
    }else{
        console.log("No notification found");
        this.notification={};
        this.notification.body = " No notification was found!! ";
    }

});

app.controller('ViewMessageCtrl', function($scope,$stateParams,$state){

    this.unreadMessages = [
        {
            "id": 1,
            "subject": "Shortlisted for mindtree",
            "from": "Mindtree HR",
            "timestamp": "20-02-2016",
            "body": "Congratulations for being shortlisted for a personal interview for mindtree",
            "assessmentDate":"24-02-2016 09:00:00"

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

    var filteredMessage = this.unreadMessages.filter(function(element) {
        return element.id == $stateParams.id;
    });
    if (filteredMessage.length > 0) {
        // we have found a corresponding element
        this.message = filteredMessage[0];
    }else{
        console.log("No message found");
    }



});