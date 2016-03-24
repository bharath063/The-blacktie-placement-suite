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
                    templateUrl : 'tabs-partial.html',
                    url:"/tabs",
                    controller:"TabsCtrl",
                    controllerAs:"Tabs"

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



    $breadcrumbProvider.setOptions({
        templateUrl: 'breadcrumb-template.html'
    });

});

