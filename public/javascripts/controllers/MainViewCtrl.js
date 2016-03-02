app.controller('MainViewCtrl', ['$scope','users',function($scope, users){

    var vm = this;
    vm.users = users.users;

    console.log("MainViewCtrl Called");

  

}

]);