/**
* Utility for generating Mashup JS code
*
* @exports workbench.utils/mashup-generator
* @owner Aiham Azmeh (aaz)
**/
define([],function(){
	"use strict";			
	/******************************************
	 * Private functions 
	 ******************************************/
	
	/**
	* removing all comments from the given string (JS comments)
	* @param {string} the code js string
	* @returns {string} the code cleaned string
	*/
	var removeComentedCode = function(txt){
		return txt.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm,'');
	};	
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
	/**
	* Matching all .{xxx}( strings for a given app variable
	* @param {string} the code js string
	* @returns {array} methods strings
	*/
	var getAppMethodsStrings = function(appVar,string){
		string = removeComentedCode(string);
		if(appVar){
			var regExp = new RegExp('('+appVar+'\\.(?!openApp)[\\S\\s]+?((\\)\\;)|(\\)\\.)))','g');
			var res = string.match(regExp);
			if(res){
				for(var i=0 ; i<res.length; i++){
					res[i]=res[i].trim();
				}
				return res;
			}else{
				return [];
			}
		}else{
			return [];
		}
	};
	/**
	* Matching method string for extracting method name and given parameters
	* @param {string} the method string
	* @returns {array} methods with parameters
	*/
	var getMethod = function(methodString){
		var method = {};
		var regExp = /\.([^\(]*)/i; //getting method name
		method['name'] = methodString.match(regExp)[0];
		var regExp = /\(([\s\S]+?)((\)\;)|(\)\.))/g;
		var paramsString = methodString.match(regExp)[0];			
		var params=[];
		if(paramsString){
			paramsString= paramsString.substring(1, paramsString.length-2);// removing parantheses
			var regExpParams = /(\{[\S\s]*\})/g;
			var obj = paramsString.match(regExpParams);
			if(obj){// we may have an object
				try{
					params.push(obj[0]);
					paramsString = paramsString.replace(obj,"");
					var otherParams = paramsString.split(',');
					for(var p=0; p<otherParams.length; p++){
						if(otherParams[p].trim()!==''){
							otherParams[p]=otherParams[p].replace(/("|')/g,'');
							params.push(otherParams[p].trim());
						}
					} 
				}catch(e){console.log(e);}
			}else{
				params=paramsString.split(',');
				//remove quotes from simple strings
				for(var k=0; k<params.length; k++){
					params[k]=params[k].replace(/("|')/g,'').trim();
				}
			};
			method['params'] = params;
		}
		return method;
	};
	/**
	 * Todo: create find app 'var' value in string  
	 */
	var findVarValue = function(strVar, string){
		/*string = removeComentedCode(string);
		var pattern = '/'+strVar+'\\s*=\\s*(\'|")(.*)(\'|")/';
		console.log(strVar, string, pattern);
		var regExp = new RegExp(pattern,'g');
		console.log(string.match(regExp));*/
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
		var regExp = /var\s+([0-9a-zA-Z_$]+)/;			
		return string.match(regExp)[1];
	};	
	
	var getMashup = function(){};
	var parseMashup = function(){};
	/*
	 * ToDo : create a method to check if string is a variable in the js code
	 */
	var addApp=function(string, appVar, appId, config){
		if(appVar.length > 0){
			return string+'\nvar '+appVar+' = qlik.openApp(\''+appId+'\', '+JSON.stringify(config)+');';
		}else{
			return string;
		}
	};
	
	var findAppById = function(appId, string){
		var apps = findApps(string);
		var res = false;
		apps.forEach(function(app){			
			if(app['appId']===appId){				
				res = app;
			}
		});
		return res;
	};
	var findAppByVar = function(appVar,string){
		var apps = findApps(string);
		var res= false;
		apps.forEach(function(app){
			if(app['appVar']===appVar){
				res= app;
			}
		});
		return res;
	};
	var findApps = function(string){
		var apps = [];
		var strings = getOpenAppStrings(string);
		strings.forEach(function(str){
			var appId = findAppId(str);			
			var appVar = findAppVar(str);
			if(appVar){
				var methods = findAppMethods(appVar, string);
			}
			apps.push({
				appId : appId,
				appVar : appVar,
				methods : methods
			});			
		});
		return apps;
	};
	var findAppMethods = function(appVar, string){
		var methods = [];
		var strings = getAppMethodsStrings(appVar, string);
		strings.forEach(function(str){
			var method = getMethod(str);
			methods.push(method);
		});
		return methods;
	};
	/* ToDo : get method promise */
	var addVisualization = function(string, appVar, params){
		if(appVar.length > 0){
			params = params.map(function(param){
				return '\''+param+'\'';
			});
			return string+'\n'+appVar+'.getObject('+params+');';
		}else{
			return string;
		}
	};
	var delVisualization = function(string,visId){
		var regExp = '([A-Za-z0-9$_]*\.getObject\(.*("|\')'+visId+'(\'|")\)(\.|;))';
		var regExp = new RegExp(regExp,'g');
		return string.replace(regExp,'');
	};
	var getVisualization = function(string, visId){
		var vis={};
		string = removeComentedCode(string);
		var regExp = '([A-Za-z0-9$_]*\.(getObject|getSnapshot)\(.*("|\')'+visId+'(\'|")\)(\.|;))';
		var regExp = new RegExp(regExp,'g');
		var res = string.match(regExp);
		if(res){
			var regExp = /\.([^\(]*)/i; //getting method name
			vis['methodName'] = res[0].match(regExp)[0];
			regExp = /\(([^)].*)\)/g;
			var betweenParenthese = res[0].match(regExp)[0];
			betweenParenthese = betweenParenthese.substring(1, betweenParenthese.length-1);			
		}
		if(betweenParenthese && betweenParenthese.length > 0 ){
			var res= betweenParenthese.split(',');			
			for(var i=0; i<res.length; i++){
				res[i] = res[i].replace(/("|')/g,'').trim();
			}
			vis['id']=res[1];
			vis['elementId']=res[0];
		}
		return vis;
	};
	
	var addCube = function(string, appVar, params){
		if(appVar.length > 0){
			return string+'\n'+appVar+'.createCube('+JSON.stringify(params[0],null,'\t')+','+params[1]+');';
		}else{
			return string;
		}
	};
	var updateCube = function(){};
	var addList = function(string, appVar, params){
		if(appVar.length > 0){		
			return string+'\n'+appVar+'.createCube('+JSON.stringify(params[0],null,'\t')+','+params[1]+');';
		}else{
			return string;
		}
	};
	var updateList = function(){};
	
	
	
	
	return {
		/* Apps */
		addApp : addApp,
		findApps : findApps,
		findAppById : findAppById,
		findAppByVar : findAppByVar, 
		findAppMethods : findAppMethods,
		/* Visualizations */
		addVisualization: addVisualization,
		delVisualization: delVisualization,
		getVisualization: getVisualization,
		/* Cubes and Lists */
		addCube : addCube,
		addList : addList
	};
});
