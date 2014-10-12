define(['text!../../resources/countries.json'],function(countries){
	return function ($scope) {		
        $scope.countries = JSON.parse(countries);
    };
});
