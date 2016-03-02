app.factory('users', [function(){
    console.log('The users factory was called');
    var o = {
    users: [
    'bharath','balan'
    ]
  };

  // o.users[0]
  return o;
  
}]);