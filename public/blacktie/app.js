var app = new angular.module('blacktie', ['ui.router','ui.bootstrap', 'ngResource','ncy-angular-breadcrumb', 'angular-loading-bar', 'ngAnimate']);


app.run(function ($state, auth) {
    if (!auth.isLoggedIn()) {
        console.log('app.config.run called');
        $state.go('login'); //make a transition to login state when app starts

    }
});

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$breadcrumbProvider',
    function ($stateProvider, $urlRouterProvider,$breadcrumbProvider) {
        $urlRouterProvider.otherwise('login');


        $urlRouterProvider.when('/student', '/student/dashboard');

        $urlRouterProvider.when('/hr', '/hr/dashboard');

        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'MainCtrl',
            onEnter: ['$state', 'auth',
                function($state, auth) {
                    if (auth.isLoggedIn()) {

                        if (auth.getCurrentUserRole() == "admin") {

                            console.log("administrator session detected while navigating to login ");

                            $state.go('admin');
                        } else if (auth.getCurrentUserRole() == "student") {

                            console.log("student session detected while navigating to login ");
                            $state.go('student');
                        } else if (auth.getCurrentUserRole() == "hr") {
                            console.log("hr session detected while navigating to login ");
                            $state.go('hr');
                        }
                    }
                }
            ]

        }).state('admin', { // state for showing all users
            url: '/admin',
            templateUrl: 'partials/users.html',
            controller: 'UserListController',
            onEnter: ['$state', 'auth',
                function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]
        }).state('admin.viewUser', { //state for showing single user
            url: '/view/:id',
            templateUrl: 'partials/user-view.html',
            controller: 'UserViewController',
            onEnter: ['$state', 'auth',
                function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]
        }).state('admin.newUser', { //state for adding a new user
            url: '/add',
            templateUrl: 'partials/user-add.html',
            controller: 'UserCreateController',

            onEnter: ['$state', 'auth',
                function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]
        }).state('admin.editUser', { //state for updating a user
            url: '/edit/:id',
            templateUrl: 'partials/user-edit.html',
            controller: 'UserEditController',
            onEnter: ['$state', 'auth',
                function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]
        });

        $stateProvider.state('student', {
            url: '/student',
            templateUrl: 'partials/student-dashboard-partial.html',
            controller: 'StudentCtrl',
            controllerAs:'Dashboard',
            ncyBreadcrumb: {
                label: 'Home'
            },

            onEnter: ['$state', 'auth',
                function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                    //$state.go('student.tab');
                }
            ]

        });

        $stateProvider.state('student.tab', {
            url: '/dashboard',
            templateUrl: 'partials/student-tabs-partial.html',
            controller: 'StudentTabsCtrl',
            controllerAs:'vm',
            ncyBreadcrumb: {
                label: 'Dashboard'
            },

            onEnter: ['$state', 'auth',
                function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]

        });

        $stateProvider.state('student.EditProfile',{
            templateUrl:"partials/student-edit-profile-partial.html",
            url:"/EditProfile",
            controller:"StudentCtrl",
            controllerAs:"vm",
            ncyBreadcrumb: {
                label: 'Edit Profile'
            }
        });


        $stateProvider.state('student.ViewNotification',{
            templateUrl:"partials/view-notification-partial.html",
            url:"/ViewNotification/:id",
            controller:"ViewNotificationCtrl",
            controllerAs:"vm",
            ncyBreadcrumb: {
                label: 'View Notification'
            }
        });


        $stateProvider.state('student.ViewMessage',{
            templateUrl:"partials/view-message-partial.html",
            url:"/ViewMessage/:id",
            controller:"ViewMessageCtrl",
            controllerAs:"vm",
            ncyBreadcrumb: {
                label: 'View Message'
            }
        });




        $stateProvider.state('hr',{
            templateUrl:"partials/hr-dashboard-partial.html",
            url:"/hr",
            controller:"HRCtrl",
            controllerAs:"Dashboard",
            ncyBreadcrumb:{
                label:'HR'
            }
        });


        $stateProvider.state('hr.editProfile',{
            templateUrl:"partials/hr-edit-profile-partial.html",
            url:"/editprofile",
            controller:"HRCtrl",
            controllerAs:"vm",
            ncyBreadcrumb:{
                label:'Edit Profile'
            }
        });

        $stateProvider.state('hr.assessmentsDashboard', {
            url: '/dashboard',
            templateUrl: 'partials/hr-assessments-dashboard-partial.html',
            controller: 'StudentTabsCtrl',
            controllerAs:'vm',
            ncyBreadcrumb: {
                label: 'Dashboard'
            },

            onEnter: ['$state', 'auth',
                function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]

        });


        // Dont forget to create controllers


        $stateProvider.state('hr.addAssessment', {
            url: '/add-assessment',
            templateUrl: 'partials/hr-add-assessment-partial.html',
            controller: 'HRAddAssessmentCtrl',
            controllerAs:'vm',
            ncyBreadcrumb: {
                label: 'Add Assessment'
            },

            onEnter: ['$state', 'auth',
                function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]

        });

        $stateProvider.state('hr.viewAssessment', {
            url: '/view-assessment',
            templateUrl: 'partials/hr-view-assessment-partial.html',
            controller: 'HRViewAssessmentCtrl',
            controllerAs:'vm',
            ncyBreadcrumb: {
                label: 'View Assessment'
            },

            onEnter: ['$state', 'auth',
                function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]

        });





        $stateProvider.state('hr.viewAssessmentResult', {
            url: '/view-assessment/result',
            templateUrl: 'partials/hr-view-assessment-result-partial.html',
            controller: 'HRViewAssessmentResultCtrl',
            controllerAs:'vm',
            ncyBreadcrumb: {
                label: 'Result'
            },

            onEnter: ['$state', 'auth',
                function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
            ]

        });







        $breadcrumbProvider.setOptions({
            templateUrl: 'partials/breadcrumb-template.html'
        });




    }
]);


app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);




app.directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});