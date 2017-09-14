app.controller("activityCtrl",[ '$scope', '$http', function ($scope, $http) {
    $scope.msg = "I love Paris";
    $scope.records = ["Andrew", "amy", "miki"];
    //make this an onload for the page
    $http.get('/api/activity').then(
          function(res) {
          	//console.log('response', res);
            if (res.data){
               console.log(res.data);
               $scope.songs = res.data;

              //auth set user
            } else { //some kind of error
              console.log('DENY');
              event.preventDefault();
            }
          },
          function(res){
          	//some kind of error
          	console.log('ACTIVITY GET ERROR');
          });
 }]);
app.controller('loginCtrl', [ '$scope', '$window', function ($scope, $window, $rootScope) {
  //submit

  $scope.login = function () {
    console.log("Loggin in request")
    // Ask to the server, do your job and THEN set the user
    $.ajax({//create an ajax request to load_page.php
                type: "POST",
                url: "http://localhost:8080/api/login",
                data:{"username": $scope.username, "password": $scope.password},
                success: function(data) {
                    if (data.user) {
                       console.log(data);

                       $window.location = '/stream';
                    }
                    else {
                        alert('Successfully not posted.');
                        $window.location = '/login'
                    }
                }
            });

  };
}])

app.controller('profileCtrl', ['$scope',  '$routeParams', '$http', '$rootScope', function ($scope, $routeParams, $http, $rootScope) {

  	$http.get('/api/'+$routeParams.username).then(
          function(res) {
          	//console.log('response', res);
            if (res.data){
                console.log(res.data);
                $scope.user = res.data;
                var arr = $scope.user.followers
				if($scope.user.username == $rootScope.user.local.username)
               		$scope.following = 0;
			  	else if (arr.indexOf($rootScope.user.local.username) > -1)
			  		$scope.following = 1;
			  	else
			  		$scope.following = -1;


            } else { //some kind of error
              console.log('User Not Found');
            }
          },
          function(res){
          	//some kind of error
          	console.log('ACTIVITY GET ERROR');
          }
    );

    $scope.follow = function(){
    	$http({
	  		method: "PATCH",
	  		url: '/follow/'+$routeParams.username,
	  		data: JSON.stringify($rootScope.user)
	  	})
    	.then(
    		function(res){
    			$scope.following = 1;
    		},function(res){
          		console.log('FOLLOW ERROR');
          	}
    	);
    }
    $scope.unfollow = function(){
    	$http({
	  		method: "PATCH",
	  		url: '/unfollow/'+$routeParams.username,
	  		data: JSON.stringify($rootScope.user)
	  	})
    	.then(
    		function(res){
    			$scope.following = -1;
    		},function(res){
          		console.log('FOLLOW ERROR');
          	}
    	);
    }
  	
}]);

app.controller('mainCtrl', ['$scope',  '$location', function ($scope, $location) {

  // $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
  //   console.log("Main controller");
  //   if(!value && oldValue) {
  //     console.log("Disconnect");
  //     $location.path('/login');
  //   }

  //   if(value) {
  //     console.log("Connect");
  //     //Do something when the user is connected
  //   }

  // }, true);
}]);