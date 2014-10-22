define(['utils/mashup-generator'],function(mashupGenerator){
	return function ($scope) {
		var $the_code = $('#the_code');
		$scope.run = function(){
			
		};
		$scope.findApps = function(){			
        	var apps = mashupGenerator.findApps($the_code[0].innerHTML);
        	document.getElementById('the_res').innerHTML='var apps = '+JSON.stringify(apps,null,'\t')+';';
        	$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.findAppById = function($event){			
			var appId = $($event.currentTarget).parent().find('input').val();			
			var app = mashupGenerator.findAppById(appId,$the_code[0].innerHTML);
			document.getElementById('the_res').innerHTML='/* for app with ID '+appId+'*/\nvar app = '+JSON.stringify(app,null,'\t')+';';
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.findAppByVar = function($event){			
			var appVar = $($event.currentTarget).parent().find('input').val();			
			var app = mashupGenerator.findAppByVar(appVar,$the_code[0].innerHTML);
			document.getElementById('the_res').innerHTML='/* for app with var '+appVar+'*/\nvar app = '+JSON.stringify(app,null,'\t')+';';
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.findAppMethods = function($event){			
			var appVar = $($event.currentTarget).parent().find('input').val();			
			var methods = mashupGenerator.findAppMethods(appVar,$the_code[0].innerHTML);
			document.getElementById('the_res').innerHTML='/* for app with var '+appVar+'*/\nvar methods = '+JSON.stringify(methods,null,'\t')+';';
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.addVisualization = function($event){
			var appVar = $($event.currentTarget).parent().find('input.app').val();
			var params = ['elementId','objectId'];
			var result_string = mashupGenerator.addVisualization($the_code[0].innerHTML, appVar, params);
			document.getElementById('the_res').innerHTML=result_string;
			document.getElementById('the_code').innerHTML=result_string;
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.delVisualization = function($event){
			var visId = $($event.currentTarget).parent().find('input.vis').val();
			var result_string = mashupGenerator.delVisualization($the_code[0].innerHTML,visId);
			document.getElementById('the_res').innerHTML=result_string;
			document.getElementById('the_code').innerHTML=result_string;
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.getVisualization = function($event){
			var visId = $($event.currentTarget).parent().find('input.vis').val();
			var visualization = mashupGenerator.getVisualization($the_code[0].innerHTML,visId);
			document.getElementById('the_res').innerHTML='var visualization = '+JSON.stringify(visualization,null,'\t')+';';
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		
		$scope.addCube = function($event){
			var appVar = $($event.currentTarget).parent().find('input.app').val();
			var result_string = mashupGenerator.addCube($the_code[0].innerHTML,appVar,['','myFunction']);
			document.getElementById('the_res').innerHTML=result_string;
			document.getElementById('the_code').innerHTML=result_string;
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
    };
});
