
'use strict';
require.config({
    paths:{
        jquery:'lib/jquery.min',
        angular:'lib/angular',
        text:'lib/text'
    },
    baseUrl:'app'
});

require(['jquery', 'angular','text'], function(){
    require(['app'],
        function (module) {
            //Bootstrap the app
            angular.element(document).ready(function() {
		      	angular.bootstrap(document, [module.name]);
		    });
        }
    );
});
