define([],function(){
	"use strict";
	/******************************************
	 * Private functions 
	 ******************************************/	
	/**
	* Matching all var {xxx} = qlik.openApp... strings
	* @param {string} the code js string
	* @returns {array} openApp strings
	*/
	var getOpenAppStrings=function(txt){
		var regExp = /\s+var\s+([a-zA-z0-9]+)\s*\=\s*qlik\.openApp\([^\)]*\)/g;
		var res = txt.match(regExp);
		if(res){ return _.map(res, function(str){ return str.trim(); });}else{ return[];}
	};
	var removeComentedCode = function(txt){		
		return txt.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm,'');
	};
	var findAppId = function(string){
		var appId = getParamsInStringFn(string)[0];
		var regExp = /('|")([^('|")]*)('|")/;
		var res = appId.match(regExp);
		if(res){
			return res[2];
		}else{
			return false;
		}
	};		
	var findAppVar = function(string){
		var regExp = /var\s+([0-9a-zA-Z_$]*)/g;			
		return string.match(regExp)[1];
	};
	var mashup = [];
	
	var getMashup = function(){};
	var parseMashup = function(){};
	
	var addApp=function(){};
	var findApp = function(string){
		
	};
	var findApps = function(string){
		var strings = getOpenAppStrings(string);
		strings.forEach(function(str){
			var appId = findAppId(str);
			var appVar = findAppVar(str);
			console.log(appId,appVar);
		});
	};
	var findAppMethods = function(){}
	
	var addVisualization = function(){}
	var delVisualization = function(){}
	var getVisualization = function(){}
	
	var addCube = function(){};
	var updateCube = function(){};
	var addList = function(){};
	var updateList = function(){};
	
	
	
	
	return {
		findApps : findApps
	};
});
