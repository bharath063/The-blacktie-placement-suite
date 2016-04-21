/**
 * Created by bharath on 10/04/16.
 */



/*

 * HR controllers start
 *
 *
 * */


app.controller('HRCtrl', function ($scope, $state,$http,auth,User) {
    //console.log("HRCtrl called");

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
            $state.reload('hr');

            $state.go('hr.assessmentsDashboard');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("An error occured while updating user profile");
        });

    };



    /*
    *
    * Use below code for updating profile without profilePic
    * Code below works fine.
    *
    *
    *
    */

    //thisthis.updateProfile = function(){
    //    console.log("Updating user profile: ");
    //    console.log(thisthis.user);
    //
    //    $http({
    //        method: 'PUT',
    //        url: '/api/users/'+auth.getCurrentUserObjectId(),
    //        headers: {
    //            'Authorization': 'Bearer ' + auth.getToken()
    //        },
    //        data: thisthis.user
    //    }).then(function (response) {
    //        // this callback will be called asynchronously
    //        // when the response is available
    //        console.log(thisthis.user);
    //        $state.reload('hr');
    //
    //        $state.go('hr.assessmentsDashboard');
    //    }, function errorCallback(response) {
    //        // called asynchronously if an error occurs
    //        // or server returns response with an error status.
    //        console.log("An error occured while updating user profile");
    //    });
    //
    //};






});



app.controller('HRAddAssessmentCtrl',function($scope,$state,$http,auth,User){
    console.log("HRAddAssessmentCtrl called");

    var thisthis = this;


    thisthis.setUser = function(){
        User.get({id: auth.getCurrentUsername()}).$promise.then(function (result) {
            //console.log(result);
            if(result.phone!= null){
                result.phone = parseInt(result.phone);
            }
            thisthis.user = result;

            if(thisthis.user.assessments.createdBy == thisthis.user.username){
                alert("You've already added an assessment");
                $state.go('hr.viewAssessment');
            }

        });

    };

    thisthis.setUser();

    thisthis.addAssessment=function(){
        if( thisthis.user.assessments.createdBy == thisthis.user.username ){
            alert("You've already added an assessment");
            return;
        }

        thisthis.updateObj = new FormData();


        if(thisthis.questionCSV){

            thisthis.updateObj.append('questionCSV',thisthis.questionCSV);
        }

        thisthis.user.assessments.createdBy = auth.getCurrentUsername();


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


            thisthis.user = response;
            $state.reload('hr');
            $state.go('hr.viewAssessment');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("An error occured while updating questions");
        });





    };


    console.log(thisthis.user.assessments);


});


app.controller('HRViewAssessmentCtrl',function($scope,$state,$http,auth,User){
    console.log("HRViewAssessmentCtrl called");

    var thisthis = this;

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

    console.log(thisthis.assessment);


});


app.controller('HRViewAssessmentResultCtrl',function($scope,$state,$http,auth,User){

    var thisthis = this;

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



    $scope.phones = [];

    $scope.$watchCollection('phones', function(newVal) {
        for (var i = 0; i < newVal.length; ++i) {

            console.log(newVal[i]);
        }
    });

    thisthis.sendMessage = function () {





        thisthis.message = prompt("Please enter the message you wish to send", "You've been invited for the next phase of interview for mindtree");
        if ( thisthis.message == null) {
            return;
        }



        $http({
            method: 'POST',
            url: '/api/hr/message/',

            headers: {
                'Authorization': 'Bearer ' + auth.getToken(),
            },
            data: {candidates:thisthis.shortlistedCandidates,message:thisthis.message,phones:$scope.phones}
        }).then(function (response) {
            // this callback will be called asynchronously
            // when the response is available
            //console.log(thisthis.user);
            alert("Message sent!");
            $state.reload('hr');

            //$state.go('hr.assessmentsDashboard');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("An error occured while updating user profile");
        });



    };

    thisthis.shortlistedCandidates = [{
        username:'12bcs013',
        fname:'Bharath',
        lname:'B',
        department:'cse',
        phone:'9843317653',
        local:{
            email:'bharath@gmail.com'
        },
        marks:90
    },{
        username:'12bcs003',
        fname:'Abinaya',
        lname:'P',
        phone:'9843317653',
        department:'cse',
        local:{
            email:'abinaya@gmail.com'
        },
        marks:100
    },{
        username:'12bcs043',
        fname:'Manoj kumar',
        lname:'M',
        phone:'9843317653',
        department:'cse',
        local:{
            email:'manoj@gmail.com'
        },
        marks:80
    },{
        username:'12bcs038',
        fname:'Monisa',
        phone:'9843317653',
        lname:'R',
        department:'cse',
        local:{
            email:'monisa@gmail.com'
        },
        marks:79
    }];




});