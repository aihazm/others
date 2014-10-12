'use strict';
define(['components/scrollbar/scrollbar','controllers/mainCtrl'],
    function (scrollbar, mainCtrl) {    	
		var app = angular.module('the_app',[]);
	    /* directives */
		app.directive('qScroll',scrollbar);
		/* controllers */
		app.controller('MainCtrl',mainCtrl);
		return app;
    }
);
