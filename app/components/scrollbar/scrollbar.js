define(['text!./scroll.ng.html'],function(template){
	
	var scrollbar = function(){
		return{
			restrict: 'EA',
	        transclude: true,
	        replace:true,
	        scope: {
	        	data:'='
	        },
	        template: template,
	        controller : ['$scope',function($scope){
	        	console.log($scope);
	        }],
	        link: function(scope, element, attrbs) {
	        	//console.log(scope);
	        }
        }
	};
	return scrollbar;
});