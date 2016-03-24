app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('login');
        $stateProvider.state('student', { // state for showing all users
            url: '/student',
            templateUrl: 'partials/student.html',
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