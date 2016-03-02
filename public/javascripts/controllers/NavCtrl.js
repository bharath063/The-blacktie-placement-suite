app.controller('NavCtrl', function () {
        var vm=this;
        vm.username = 'Bharath';
        
        vm.unreadMessages = [
        {
        "id":1,
        "subject":"Shortlisted for mindtree",
        "from":"Mindtree HR",
        "date":"20-02-2016",
        "body":"Congratulations for being shortlisted for a personal interview for mindtree"
        },{
        "id":2,
        "subject":"Shortlisted for Skava",
        "from":"Skava HR",
        "date":"20-02-2016",
        "body":"Congratulations for being shortlisted for a personal interview for Skava"
        },{
        "id":3,
        "subject":"Password reset request",
        "from":"Admin",
        "date":"18-02-2016",
        "body":"Your password reset was successful"
        }
        ];
        vm.unreadNotifications = [
        {
        "id":1,
        "title":"Job invitation from Skava",
        "date":"20-02-2016",
        "body":"You have been invited to take a test for skava"
        },{
        "id":2,
        "title":"Job invitation from TCS",
        "date":"20-02-2016",
        "body":"You have been invited to take a test for TCS"
        },
        {
        "id":3,
        "title":"Exam reminder",
        "date":"20-02-2016 2 P.M",
        "body":"The assessment for Infosys is underway right now"
        },
        {
        "id":4,
        "title":"Job invitation from Mindtree",
        "date":"20-02-2016",
        "body":"You have been invited to take a test for Mindtree"
        },
        {
        "id":6,
        "title":"Job invitation from Moris",
        "date":"20-02-2016",
        "body":"You have been invited to take a test for Mindtree"
        }
        ];
        var incomingNotification = {"id":4,
        "title":"Job invitation from Infosys",
        "body":"You have been invited to take a test for Infosys"};
        vm.unreadNotifications.push(incomingNotification);
        });