define(['utils/mashup-generator'],function(mashupGenerator){
	return function ($scope) {
		var $the_code = $('#the_code');
		$scope.run = function(){
			
		};
		$scope.findApps = function(){
        	var apps = mashupGenerator.findApps($the_code.val());        	
        	document.getElementById('the_res').innerHTML='var apps = '+JSON.stringify(apps,null,'\t')+';';
        	$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.addApp = function($event){			
			var appId = $($event.currentTarget).parent().find('input').val();
			var appVar = 'new_app';
			var config = 'config';
			var result_string = mashupGenerator.addApp($the_code.val(), appVar, appId,config);			
			document.getElementById('the_res').innerHTML=result_string;
			document.getElementById('the_code').innerHTML=result_string;
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.findAppById = function($event){			
			var appId = $($event.currentTarget).parent().find('input').val();			
			var app = mashupGenerator.findAppById(appId,$the_code.val());
			document.getElementById('the_res').innerHTML='/* for app with ID '+appId+'*/\nvar app = '+JSON.stringify(app,null,'\t')+';';
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.findAppByVar = function($event){			
			var appVar = $($event.currentTarget).parent().find('input').val();			
			var app = mashupGenerator.findAppByVar(appVar,$the_code.val());
			document.getElementById('the_res').innerHTML='/* for app with var '+appVar+'*/\nvar app = '+JSON.stringify(app,null,'\t')+';';
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.findAppMethods = function($event){			
			var appVar = $($event.currentTarget).parent().find('input').val();			
			var methods = mashupGenerator.findAppMethods(appVar,$the_code.val());
			document.getElementById('the_res').innerHTML='/* for app with var '+appVar+'*/\nvar methods = '+JSON.stringify(methods,null,'\t')+';';
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.addObject = function($event){
			var appVar = $($event.currentTarget).parent().find('input.app').val();
			var params = ['elementId','objectId'];
			var result_string = mashupGenerator.addObject($the_code.val(), appVar, params);
			document.getElementById('the_res').innerHTML=result_string;
			document.getElementById('the_code').innerHTML=result_string;
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.addSnapshot = function($event){
			var appVar = $($event.currentTarget).parent().find('input.app').val();
			var params = ['elementId','objectId'];
			var result_string = mashupGenerator.addSnapshot($the_code.val(), appVar, params);
			document.getElementById('the_res').innerHTML=result_string;
			document.getElementById('the_code').innerHTML=result_string;
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.delVisualization = function($event){
			var visId = $($event.currentTarget).parent().find('input.vis').val();
			var result_string = mashupGenerator.delVisualization($the_code.val(),visId);
			document.getElementById('the_res').innerHTML=result_string;
			document.getElementById('the_code').innerHTML=result_string;
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.getVisualization = function($event){
			var visId = $($event.currentTarget).parent().find('input.vis').val();
			var visualization = mashupGenerator.getVisualization($the_code.val(),visId);
			document.getElementById('the_res').innerHTML='var visualization = '+JSON.stringify(visualization,null,'\t')+';';
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		
		$scope.addCube = function($event){
			var cube = {//example cube
				qDimensions : [{
					qDef : {
						qFieldDefs : ["FirstName"]
					}
				}, {
					qDef : {
						qFieldDefs : ["LastName"]
					}
				}],
				qMeasures : [{
					qDef : {
						qDef : "1"
					}
				}],
				qInitialDataFetch : [{
					qTop : 0,
					qLeft : 0,
					qHeight : 20,
					qWidth : 3
				}]
			};
			var appVar = $($event.currentTarget).parent().find('input.app').val();
			var result_string = mashupGenerator.addCube($the_code.val(),appVar,[cube,'myFunction']);
			document.getElementById('the_res').innerHTML=result_string;
			document.getElementById('the_code').innerHTML=result_string;
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		$scope.addList = function($event){
			var list = {
				qDef: {
					qFieldDefs: [
						"LastName"
					]
				},
				qInitialDataFetch: [{
						qTop : 0,
						qLeft : 0,
						qHeight : 20,
						qWidth : 1
					}]
			};
			var appVar = $($event.currentTarget).parent().find('input.app').val();
			var result_string = mashupGenerator.addList($the_code.val(),appVar,[list,'myFunction']);
			document.getElementById('the_res').innerHTML=result_string;
			document.getElementById('the_code').innerHTML=result_string;
			$('pre code').each(function(i, block) { hljs.highlightBlock(block);});
		};
		/*	var objectVar = {'test':12, 'test2':21};
			var arrayVar = [1,2,3,4];
			var stringVar = "test";
			var functionVar = function(foo){var bar=foo;};
		 */
		
		var vObject = mashupGenerator.findVarValue('objectVar',$the_code.val());
		var vArray = mashupGenerator.findVarValue('arrayVar',$the_code.val());
		var vString = mashupGenerator.findVarValue('stringVar',$the_code.val());
		var vfunction = mashupGenerator.findVarValue('functionVar',$the_code.val());
		//console.log(vObject,vArray,vString,vfunction);
    };
});
