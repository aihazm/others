define(['utils/mashup-generator'],function(mashupGenerator){
	return function ($scope) {
		$scope.run = function(){
			var $the_code = $('#the_code');			 
        	var openAppStrs = mashupGenerator.findApps($the_code[0].innerHTML);
		};        
    };
});
