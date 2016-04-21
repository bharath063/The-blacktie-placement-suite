/**
 * Created by bharath on 10/04/16.
 */
/*
 *
 * Student Controllers start
 *
 * */

app.controller('StudentCtrl', function ($scope, $stateParams, $http,$state,auth,User) {

    //console.log("StudentCtrl called");

    var thisthis= this;

    thisthis.setUser = function(){
        User.get({id: auth.getCurrentUsername()}).$promise.then(function (result) {
            //console.log(result);
            if(result.phone!= null){
                result.phone = parseInt(result.phone);
            }
            thisthis.user = result;

        });

    };

    thisthis.setUser();




    thisthis.updateProfile = function(){
        console.log("Updating user profile: ");

        thisthis.updateObj = new FormData();


        if(thisthis.profilePicFile){

            thisthis.updateObj.append('profilePic',thisthis.profilePicFile);
        }

        if(thisthis.resumeFile){

            thisthis.updateObj.append('resume',thisthis.resumeFile);
        }


        thisthis.updateObj.append('item', JSON.stringify(thisthis.user));


        console.log(thisthis.updateObj);



        $http({
            method: 'PUT',
            url: '/api/users/'+auth.getCurrentUserObjectId(),
            transformRequest: angular.identity,
            headers: {
                'Authorization': 'Bearer ' + auth.getToken(),
                'Content-Type': undefined
            },
            data: thisthis.updateObj
        }).then(function (response) {
            // this callback will be called asynchronously
            // when the response is available
            //console.log(thisthis.user);
            $state.reload('student');

            $state.go('student.tab');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("An error occured while updating student profile");
        });

    };



    /*
    *
    *
    * Code below is for without resume
    *
    * */

    //thisthis.updateProfile = function(){
    //    console.log("Updating user profile: ");
    //    console.log(thisthis.user);
    //
    //    var updateObj = thisthis.user;
    //    if(updateObj.phone!=null){
    //        updateObj.phone = updateObj.phone.toString();
    //    }
    //
    //
    //
    //    $http({
    //        method: 'PUT',
    //        url: '/api/users/'+auth.getCurrentUserObjectId(),
    //        headers: {
    //            'Authorization': 'Bearer ' + auth.getToken()
    //        },
    //        data: updateObj
    //    }).then(function (response) {
    //        // this callback will be called asynchronously
    //        // when the response is available
    //
    //        thisthis.setUser();
    //        $state.go('student.tab');
    //    }, function errorCallback(response) {
    //        // called asynchronously if an error occurs
    //        // or server returns response with an error status.
    //        console.log("An error occured while updating user profile");
    //    });
    //
    //};




    //$state.go("student.tabs");


});


app.controller('EditProfileCtrl', function ($scope, $state) {

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

app.controller('StudentTabsCtrl', function ($scope) {
    //console.log("StudentTabsCtrl called");

});


app.controller('MessagesCtrl', function ($scope) {

    //console.log("MessageCtrl invoked");

    this.unreadMessages = [
        {
            "id": 1,
            "subject": "Shortlisted for mindtree",
            "from": "Mindtree HR",
            "timestamp": "20-02-2016",
            "body": "Congratulations for being shortlisted for a personal interview for mindtree",
            "assessmentDate": "24-02-2016 09:00:00"

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


app.controller('NotificationsCtrl', function ($scope) {

    //console.log("NotificationsCtrl invoked");


    this.unreadNotifications = [{
        "id": 1,
        "title": "Job invitation from HP",
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


app.controller('ViewNotificationCtrl', function ($scope, $stateParams, $state) {

    this.unreadNotifications = [{
        "id": 1,
        "title": "Job invitation from HP",
        "timestamp": "20-02-2016",
        "body": "You have been invited to take a test for HP",
        "aboutCompany":" HP Inc. is an American technology company, created on November 1, 2015 as the successor of Hewlett-Packard, along with Hewlett Packard Enterprise.It develops and provides hardware, such as personal computers and printers.HP Inc. is the larger successor of Hewlett-Packard in terms of revenue, and uses the original NYSE ticker symbol of HPQ (whereas Hewlett Packard Enterprise uses a new ticker, HPE).",
        "jobLocation":"Bangalore",
        "jobRole":"<ul> <li>Resolving technical issues (hardware and software) from incoming internal or external businesses and end user's contacts and proactive notification system</li>  <li>Providing excellent customer service support to customers during every single interaction    </li>    <li>    Assisting end users to avoid or reduce problem occurrences and adding case resolution to Knowledge Management System    </li>    <li>    Proactively assisting internal or external businesses and end users to avoid or reduce problem occurrence and providing direction and guidance to process improvements.    </li>    <li>    Representing and leading an HP team in a face to face customer location visit, industry conference/trade show, vendor meeting, etc.    </li>    </ul>    ",
        'salary':'2.4',
        'minCgpa':'6.5'
    }, {
        "id": 2,
        "title": "Job invitation from TCS",
        "timestamp": "20-02-2016",
        "body": "You have been invited to take a test for TCS"
    },  {
        "id": 3,
        "title": "Job invitation from Mindtree",
        "timestamp": "20-02-2016",
        "body": "You have been invited to take a test for Mindtree"
    }, {
        "id": 4,
        "title": "Job invitation from Moris",
        "timestamp": "20-02-2016",
        "body": "You have been invited to take a test for Moris"
    }
    ];

    var filteredNotification = this.unreadNotifications.filter(function (element) {
        return element.id == $stateParams.id;
    });
    if (filteredNotification.length > 0) {
        // we have found a corresponding element
        this.notification = filteredNotification[0];
    } else {
        console.log("No notification found");
        this.notification = {};
        this.notification.body = " No notification was found!! ";
    }

});

app.controller('ViewMessageCtrl', function ($scope, $stateParams, $state) {

    this.unreadMessages = [
        {
            "id": 1,
            "subject": "Shortlisted for mindtree",
            "from": "Mindtree HR",
            "timestamp": "20-02-2016",
            "body": "Congratulations for being shortlisted for a personal interview for Mindtree. The next phase of interview will be on 22/02/2016. Reporting time: 09:00 AM.  We are looking forward to meeting you. If you have any clarifications reach out to us at hr@mindtree.com",
            "assessmentDate": "24-02-2016 09:00:00"

        }, {
            "id": 2,
            "subject": "Shortlisted for Skava",
            "from": "Skava HR",
            "timestamp": "20-02-2016",
            "body": "Congratulations for being shortlisted for a personal interview for Skava"
        }];

    var filteredMessage = this.unreadMessages.filter(function (element) {
        return element.id == $stateParams.id;
    });
    if (filteredMessage.length > 0) {
        // we have found a corresponding element
        this.message = filteredMessage[0];
    } else {
        console.log("No message found");
    }


});