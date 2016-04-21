/**
 * Created by bharath on 23/03/16.
 */


app.controller('MainCtrl', [
    '$scope',
    '$state',
    'auth', function ($scope, $state, auth) {



        // This is the user login controller

        this.isLoggedIn = auth.isLoggedIn;
        this.logOut = function () {

            this.UserLoginData = {};

            auth.logOut();
        };

        console.log("MainCtrl (Login controller) Called");

        this.UserLoginData = {};


        this.logIn = function () {
            auth.logIn(this.UserLoginData).error(function (error) {
                $scope.error = error;
            }).then(function () {
                console.log("Current user role : " + auth.getCurrentUserRole());

                if (auth.getCurrentUserRole() == "admin") {

                    console.log("Admin detected");

                    $state.go('admin');
                } else if (auth.getCurrentUserRole() == "student") {

                    console.log("student detected from Controller ");
                    $state.go('student');
                } else if (auth.getCurrentUserRole() == "hr") {
                    console.log("hr detected");
                    $state.go('hr');
                }


            });
        };


    }]);


app.controller('UserListController', function ($scope, $state, popupService, $window, User) {


    console.log($scope.user);

    $scope.users = User.query(); //fetch all users. Issues a GET to /api/users

    $scope.deleteUser = function (user) { // Delete a user. Issues a DELETE to /api/users/:id
        if (popupService.showPopup('Really delete this?')) {
            user.$delete(function () {
                $state.go('admin'); //redirect to home
            });
        }
    };
}).controller('UserViewController', function ($scope, $state,$stateParams, User,$http,auth) {


    User.get({id: $stateParams.id}).$promise.then(function (data) {
        $scope.user = data;
    });

    $scope.resetPassword = function(){

        console.log('Reset password requested ');


        $http({
            method: 'PUT',
            url: '/api/users/resetPassword/'+$scope.user._id,
            headers: {
                'Authorization': 'Bearer ' + auth.getToken(),
            }
        }).then(function (response) {
            // this callback will be called asynchronously
            // when the response is available
            //console.log(thisthis.user);
            $state.reload('admin');
            $state.go('admin');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("An error occured while resetting user password");
        });
    }


}).controller('UserCreateController', function ($scope, $state, $stateParams, User) {
    $scope.user = new User(); //create new user instance. Properties will be set via ng-model on UI

    $scope.addUser = function () { //create a new user. Issues a POST to /api/users
        alert("creating an user");
        $scope.user.$save(function () {
            $state.go('admin'); // on success go back to home i.e. users state.
        });
    };
}).controller('UserEditController', function ($scope, $state, $stateParams, User) {
    $scope.updateUser = function () { //Update the edited user. Issues a PUT to /api/users/:id
        $scope.user.$update(function () {
            $state.go('admin'); // on success go back to home i.e. users state.
        });
    };

    $scope.loadUser = function () { //Issues a GET request to /api/users/:id to get a user to update
        $scope.user = User.get({
            id: $stateParams.id
        });
    };

    $scope.loadUser(); // Load a user which can be edited on UI
});





