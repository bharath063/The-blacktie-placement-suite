/**
 * Created by bharath on 22/03/16.
 */
var app = new angular.module('blacktie', ['ui.router','ngResource','ui.bootstrap','ngAnimate','ncy-angular-breadcrumb']);

/* Configuring student states */



app.config(function($stateProvider,$urlRouterProvider,$breadcrumbProvider) {

    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider.state('dashboard',
        {
            templateUrl : 'dashboard-partial.html',
            url : '/dashboard',
            controller : 'DashboardCtrl',
            ncyBreadcrumb: {
                label: 'Home'
            },
            views: {
                "dashboard": {
                    templateUrl: "dashboard-partial.html",
                },
                "@dashboard":{
                    templateUrl : 'assessments-dashboard-partial.html',
                    url:"/assessments",
                    controller:"AssessmentsCtrl",
                    controllerAs:"assessments"

                },
                "ProfileView@dashboard":{
                    templateUrl : 'profile-view-partial.html',

                },



            }

        }
    );

    $stateProvider.state('dashboard.EditProfile',{
        templateUrl:"student-edit-profile-partial.html",
        url:"/EditProfile",
        controller:"EditProfileCtrl",
        controllerAs:"vm",
        ncyBreadcrumb: {
            label: 'Edit Profile'
        }
    });


    $stateProvider.state('dashboard.ViewNotification',{
        templateUrl:"view-notification-partial.html",
        url:"/ViewNotification/:id",
        controller:"ViewNotificationCtrl",
        controllerAs:"vm",
        ncyBreadcrumb: {
            label: 'View Notification'
        }
    });


    $stateProvider.state('dashboard.ViewMessage',{
        templateUrl:"view-message-partial.html",
        url:"/ViewMessage/:id",
        controller:"ViewMessageCtrl",
        controllerAs:"vm",
        ncyBreadcrumb: {
            label: 'View Message'
        }
    });



    $stateProvider.state('dashboard.addAsssessment',{
        templateUrl:"hr-add-assessment-partial.html",
        url:"/add-assessment",
        controller:"AddAssessmentCtrl",
        controllerAs:"vm",
        ncyBreadcrumb: {
            label: 'Add Assessment'
        }
    });



    $stateProvider.state('dashboard.viewAsssessment',{
        templateUrl:"hr-view-assessment-partial.html",
        url:"/view-assessment",
        controller:"ViewAssessmentCtrl",
        controllerAs:"vm",
        ncyBreadcrumb: {
            label: 'View Assessment'
        }
    });


    $stateProvider.state('dashboard.viewAssessmentResult',{
        templateUrl:"hr-view-assessment-result-partial.html",
        url:"/view-assessment-result",

        controller:"ViewAssessmentCtrl",
        controllerAs:"vm",
        ncyBreadcrumb: {
            label: 'View Assessment Result'
        }
    });


    $breadcrumbProvider.setOptions({
        templateUrl: 'breadcrumb-template.html'
    });

});

