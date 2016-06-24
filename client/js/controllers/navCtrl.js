app.controller('navCtrl', function($scope, $location){
	$scope.isActive = function(destination){
		var location = $location.path();
		if(location.split('/').length > 2){
			location = '/' + location.split('/')[1];
		}
		
		return destination === location;
	}
});