var app = new angular.module('blacktie', ['ui.router', 'ngResource','angular-loading-bar','ngAnimate']);

app.factory('User', ['$resource', 'auth',
    function($resource, auth) {
        var resource = $resource('/api/users/:id', {
            id: '@_id'
        }, {
            update: {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken()
                }
            },
            get: {
                method: 'GET',
                isArray: false,
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken()
                }
            },
            query: {
                method: 'GET',
                isArray: true,
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken()
                }
            },
            delete: {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken()
                }
            },
            save: {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken()
                }
            },
            stripTrailingSlashes: true

        });


        return resource;
    }
]);

app.service('popupService', function($window) {
    this.showPopup = function(message) {
        return $window.confirm(message);
    }
});

app.factory('auth', ['$http', '$window',
    function($http, $window) {
        var auth = {};

        auth.saveToken = function(token) {
            $window.localStorage['blacktie-token'] = token;
        };

        auth.getToken = function() {
            return $window.localStorage['blacktie-token'];
        }

        auth.isLoggedIn = function() {
            var token = auth.getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.currentUser = function() {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.logIn = function(user) {
            return $http.post('/login', user).success(function(data) {
                auth.saveToken(data.token);
            });
        };
        auth.logOut = function() {
            $window.localStorage.removeItem('blacktie-token');
        };

        return auth;
    }
]);




app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('login');
        $stateProvider.state('users', { // state for showing all users
            url: '/users',
            templateUrl: 'partials/users.html',
            controller: 'UserListController',
            onEnter: ['$state', 'auth',
                function($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]
        }).state('viewUser', { //state for showing single user
            url: '/users/:id/view',
            templateUrl: 'partials/user-view.html',
            controller: 'UserViewController',
            onEnter: ['$state', 'auth',
                function($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]
        }).state('newUser', { //state for adding a new user
            url: '/users/new',
            templateUrl: 'partials/user-add.html',
            controller: 'UserCreateController',
            onEnter: ['$state', 'auth',
                function($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]
        }).state('editUser', { //state for updating a user
            url: '/users/:id/edit',
            templateUrl: 'partials/user-edit.html',
            controller: 'UserEditController',
            onEnter: ['$state', 'auth',
                function($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]
        }).state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth',
                function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('users');
                    }
                }
            ]
        }).state('student', {
            url: '/student',
            templateUrl: 'partials/student-profile-own.html',
            controller: 'StudentController',
            onEnter: ['$state', 'auth',
                function($state, auth) {
                    if (!auth.isLoggedIn()) {

                        $state.go('login');
                    }
                }
            ]
        })

    }
]).run(function($state,auth) {
    if (!auth.isLoggedIn()) {
    console.log('here');
        $state.go('users'); //make a transition to users state when app starts

    }
});




app.controller('UserListController', function($scope, $state, popupService, $window, User) {

    
    console.log($scope.user);

    $scope.users = User.query(); //fetch all users. Issues a GET to /api/users

    $scope.deleteUser = function(user) { // Delete a user. Issues a DELETE to /api/users/:id
        if (popupService.showPopup('Really delete this?')) {
            user.$delete(function() {
                $window.location.href = ''; //redirect to home
            });
        }
    };
}).controller('UserViewController',function( $scope, $stateParams, User) {

    User.get( {id: $stateParams.id} ).$promise.then(function(data) {
        $scope.user = data;
    });

    


}).controller('UserCreateController', function($scope, $state, $stateParams, User) {
    $scope.user = new User(); //create new user instance. Properties will be set via ng-model on UI

    $scope.addUser = function() { //create a new user. Issues a POST to /api/users
        $scope.user.$save(function() {
            $state.go('users'); // on success go back to home i.e. users state.
        });
    };
}).controller('UserEditController', function($scope, $state, $stateParams, User) {
    $scope.updateUser = function() { //Update the edited user. Issues a PUT to /api/users/:id
        $scope.user.$update(function() {
            $state.go('users'); // on success go back to home i.e. users state.
        });
    };

    $scope.loadUser = function() { //Issues a GET request to /api/users/:id to get a user to update
        $scope.user = User.get({
            id: $stateParams.id
        });
    };

    $scope.loadUser(); // Load a user which can be edited on UI
});

app.controller('StudentController',  function( $scope, $stateParams, User) {

    User.get( {id: $stateParams.id} ).$promise.then(function(data) {
        $scope.user = data;
        console.log("Student detected: "+$scope.user.username);

        })});


app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth) {
        $scope.user = {};

        $scope.logIn = function() {
            auth.logIn($scope.user).error(function(error) {
                $scope.error = error;
            }).then(function() {
                if ($scope.user.username=="admin") {
                    $state.go('users');    
                }else{
                    $state.go('student');    
                }
                
            });
        };
    }
]);



// app.controller('MainCtrl', ['$scope',
//     function($scope) {

//         // This controller controls the body
//         $scope.test = 'Hello world!';
//         console.log("MainCtrl Called");
//     }
// ]);
// app.controller('MainViewCtrl', ['$scope', 'users',
//     function($scope, users) {
//         // This controller controls the ng-view inside the body
//         var $scope = this;
//         vm.users = users.users;

//         console.log("MainViewCtrl Called");

//     }

// ]);


// app.controller('UsersCtrl', ['$scope', '$stateParams', 'users',
//     function($scope, $stateParams, users) {

//         //  This controller controls the fetching and displaying of users
//         console.log("UsersCtrl Called");
//         $scope.user = users.users[$stateParams.id];
//         console.log('Requested userId : ' + $stateParams.id);
//         console.log('Fetched user email : ' + $scope.user.email);





//     }
// ]);

// app.controller('UsersAllCtrl', ['$scope', '$stateParams', 'users',
//     function($scope, $stateParams, users) {

//         //  This controller controls the fetching and displaying of users
//         console.log("UsersAllCtrl Called");
//         $scope.users = users.users;

//         $scope.addUser = function() {
//             if ($scope.email === '') {
//                 return;
//             }
//             users.users.push({
//                 email: $scope.email,
//                 phone: $scope.phone,
//             });
//             $scope.email = '';
//             $scope.phone = '';
//         };


//         $scope.removeUser = function(item) {
//             var index = users.users.indexOf(item);
//             users.users.splice(index, 1);
//         };


//     }
// ]);


app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth ) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.username = auth.currentUser;
        $scope.logOut = auth.logOut;

        console.log("NavCtrl Called");


        // This controller controls the navbar buttons and menus
        
        // $scope.username = user.username;

        $scope.unreadMessages = [{
            "id": 1,
            "subject": "Shortlisted for mindtree",
            "from": "Mindtree HR",
            "date": "20-02-2016",
            "body": "Congratulations for being shortlisted for a personal interview for mindtree"
        }, {
            "id": 2,
            "subject": "Shortlisted for Skava",
            "from": "Skava HR",
            "date": "20-02-2016",
            "body": "Congratulations for being shortlisted for a personal interview for Skava"
        }, {
            "id": 3,
            "subject": "Password reset request",
            "from": "Admin",
            "date": "18-02-2016",
            "body": "Your password reset was successful"
        }];
        $scope.unreadNotifications = [{
            "id": 1,
            "title": "Job invitation from Skava",
            "date": "20-02-2016",
            "body": "You have been invited to take a test for skava"
        }, {
            "id": 2,
            "title": "Job invitation from TCS",
            "date": "20-02-2016",
            "body": "You have been invited to take a test for TCS"
        }, {
            "id": 3,
            "title": "Exam reminder",
            "date": "20-02-2016 2 P.M",
            "body": "The assessment for Infosys is underway right now"
        }, {
            "id": 4,
            "title": "Job invitation from Mindtree",
            "date": "20-02-2016",
            "body": "You have been invited to take a test for Mindtree"
        }, {
            "id": 6,
            "title": "Job invitation from Moris",
            "date": "20-02-2016",
            "body": "You have been invited to take a test for Mindtree"
        }];
        var incomingNotification = {
            "id": 4,
            "title": "Job invitation from Infosys",
            "date": "20-02-2016",
            "body": "You have been invited to take a test for Infosys"
        };
        $scope.unreadNotifications.push(incomingNotification);
    }
]);




app.controller('StudentTabCtrl', function ($scope, $window) {
  $scope.tabs = [
    { title:'Dynamic Title 1', content:'Dynamic content 1' },
    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
  ];

  $scope.alertMe = function() {
    setTimeout(function() {
      $window.alert('You\'ve selected the alert tab!');
    });
  };

  $scope.model = {
    name: 'Tabs'
  };
});