'use strict';
define(['controllers/mainCtrl'],
    function (mainCtrl) {    	
		var app = angular.module('the_app',[]);
		/* controllers */
		app.controller('MainCtrl',mainCtrl);
		return app;
    }
);
