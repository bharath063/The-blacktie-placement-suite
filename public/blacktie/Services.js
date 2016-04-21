/**
 * Created by bharath on 08/04/16.
 */
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
                    'Authorization': 'Bearer ' + auth.getToken(),
                    'Content-Type': undefined
                }
            },
            stripTrailingSlashes: true

        });


        return resource;
    }
]);

app.factory('StudentProfileFactory', ['$resource', 'auth',
    function($resource, auth) {
        var resource = $resource('/api/student/profile/:id', {
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

        auth.getCurrentUserRole = function() {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.role;
            }
        };


        auth.getCurrentUsername = function() {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.getCurrentUserObjectId = function() {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload._id;
            }
        };




        auth.getCurrentUsername = function() {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.getCurrentUser = function(){

            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                console.log("payload contains: ");

                console.log(payload);


                return payload;
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


