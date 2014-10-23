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
	
	var qextList2listObj = function(qextList){
		var listObj = {};
		if(!qextList.measures){ qextList.measures = []; }		
		if(qextList.dimid){
			listObj['qLibraryId']=qextList.dimid
		}else{
			listObj['qDef'] = {qFieldDefs: [qextList.field]};
			listObj['qFrequencyMode'] = ( qextList.freq || 'N' );
		}
		if ( qextList.measures.length > 0 ) {
			listObj['qExpressions']=[];
			qextList.measures.foreach(function(meas, key){
				if ( meas.id ) {
					listObj['qExpressions'].push({qLibraryId : meas.id});
				} else {
					listObj['qExpressions'].push({ qExpr : meas.def});
				}
			});
		}
		listObj['qInitialDataFetch'] = [{qHeight: qextList.rows ,qWidth: ( 1 + qextList.measures.length ) }];
		return listObj;
	};
	
	var qextCube2cubeObj = function(qextCube){
		var cubeObj = {	qDimensions:[]};
		qextCube.dimensions.forEach( function ( dim, key ) {
			var dimObj = {};
			if(qextCube.dimid){
				dimObj['qLibraryId']=dim.dimid
			}else{
				dimObj['qDef'] = {qFieldDefs: ["'" + dim.field + "'"]};
			}
			if(dim.limit !== 'OTHER_OFF'){
				dimObj['qOtherTotalSpec']=={
					qOtherMode: dim.limit
				}
				if(dim.limit === 'OTHER_COUNTED'){
					dimObj['qOtherTotalSpec']['qOtherCounted']=dim.otherCounted;
				}else{
					dimObj['qOtherTotalSpec']['qOtherLimit']={qv:dim.otherLimit};
					dimObj['qOtherTotalSpec']['qOtherLimitMode']=dim.otherLimitMode;
				}
				dimObj['qOtherTotalSpec']['qOtherSortMode']=dim.otherSortMode;
			}
			cubeObj['qDimensions'].push(dimObj);
		});
		if ( qextCube.measures.length > 0 ) {
			cubeObj['qMeasures'] =[];
			qextCube.measures.forEach(function(meas, key){
				if ( meas.id ) {
					cubeObj['qMeasures'].push({qLibraryId : meas.id , qLabel : meas.def });
				} else {
					cubeObj['qDef'].push({qDef : meas.def , qLabel : meas.label });
				}
			});
		}
		cubeObj['qInitialDataFetch'] = [{qHeight: qextCube.rows ,qWidth: ( qextCube.dimensions.length + qextCube.measures.length ) }];
		return cubeObj;
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
	* @param {string} appVar - the actual app var
	* @param {string} string - the code js string
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
	* @param {string} methodString - the method string
	* @returns {array} methods with parameters
	*/
	var getMethod = function(methodString){		
		var method = {};
		var regExp = /\.([^\(]*)/i; //getting method name
		method['name'] = methodString.match(regExp)[0];
		var regExp = /\(([\s\S]+?)((\)\;)|(\)\.))/g;
		var paramsString = methodString.match(regExp)[0];			
		var params=[];
		// Obs the order is imperative 1st test functions 2nd test objects 3rd test string 4th test vars
		if(paramsString){
			paramsString= paramsString.substring(1, paramsString.length-2);// removing parantheses
			//testing document.getElementById('')
			var regExpParam = /(document.getElementById\(('|").*('|")\))/g;
			var domEl = paramsString.match(regExpParam);
			if(domEl){
				domEl.forEach(function(d){
					params.push(d);
					paramsString = paramsString.replace(d,"");//let's remove the found string
				});				
			}
			//testing functions
			var regExpParam = /(function\(.*\)\{[\\S\\s]*\})/g;
			var fn = paramsString.match(regExpParam);
			if(fn){
				fn.forEach(function(f){
					params.push(eval('('+f+')'));
					paramsString = paramsString.replace(f,"");//let's remove the found string
				});				
			}
			//testing object			
			var regExpParam = /({[\S\s]*})/g;
			var obj = paramsString.match(regExpParam);
			if(obj){
				//we have an object
				obj.forEach(function(o){
					params.push(eval('('+o+')'));
					paramsString = paramsString.replace(o,"");//let's remove the found string
				});								
			}
			//testing string
			var regExpParam = /(("|')[^("|')]*("|'))/g;
			var string = paramsString.match(regExpParam);
			if(string){				
				//we have a string
				string.forEach(function(str){
					params.push(eval('('+str+')'));
					paramsString = paramsString.replace(str,"");//let's remove the found string
				});								
			}
			//testing var wich can be strings, functions arrays or objects
			var regExpParam = /([^\s,][A-Za-z0-9$_]*)/g;
			var variable = paramsString.match(regExpParam);			
			if(variable){				
				//we have a string
				variable.forEach(function(v){
					/** @todo implement finVarValue in all string ::: if(findVarValue()) */					
					params.push(v);
					paramsString = paramsString.replace(v,"");//let's remove the found string
				});								
			}			
			method['params'] = params;
		}
		return method;
	};
	/**
	* Match the value of a variable 
	* @param {string} strVar - the var string
	* @param {string} string - the js code
	* @returns {string|object|array|function} the "compiled" value
	*/
	var findVarValue = function(strVar, string){
		string = removeComentedCode(string);
		var res = false;
		/* testing string */
		var pattern = strVar+'\\s*=\\s*(\'|")(.*)(\'|")';
		var regExp = new RegExp(pattern,'g');		
		var res = string.match(regExp);
		if(res){
			res = res[0].match(/('|")(.*)('|")/g);
			return res[0].replace(/("|')/g,'').trim();
		}
		/* testing object */
		var pattern = strVar+'\\s*=\\s*{([^}]+)}';
		var regExp = new RegExp(pattern,'g');		
		var res = string.match(regExp);
		if(res){
			res = res[0].match(/{[\S\s]*}/g);
			return eval("("+res+")");
		}
		/* testing array */
		var pattern = strVar+'\\s*=\\s*\\[([^\\]]+)\\]';
		var regExp = new RegExp(pattern,'g');		
		var res = string.match(regExp);
		if(res){
			res = res[0].match(/\[([^\]]+)\]/g);
			res[0] = res[0].replace(/(\r\n|\n|\r)/gm,'');
			return eval("("+res[0]+")");
		}
		/* testing function */
		var pattern = strVar+'\\s*=\\s*(function\(.*\)\{[\\S\\s]*\})';
		var regExp = new RegExp(pattern,'g');		
		var res = string.match(regExp);
		if(res){			
			res = res[0].match(/(function\(.*\)\{[\S\s]*\})/g);						
			return eval("("+res[0]+")");
		}
		return res;
	};
	/**
	* Search for the appId in the openApp string 
	* @param {string} openAppStr
	* @param {string} string - the js code
	* @returns {string} the "appId" value
	*/
	var findAppId = function(openAppStr, string){
		var appId = getParamsInStringFn(openAppStr)[0];		
		var regExp = /('|")([^('|")]*)('|")/;
		var res = appId.match(regExp);
		if(res){
			return res[2];
		}else{
			if(string){
				//let's try to find the appId in a var
				return findVarValue(appId, string);
			}
			return false;
		}
	};
	/**
	* Search for appVar in string (line) 
	* @param {string} string
	* @returns {string} the "appVar" value
	*/
	var findAppVar = function(string){
		var regExp = /var\s+([0-9a-zA-Z_$]+)/;
		return string.match(regExp)[1];
	};
	
	var getMashup = function(){};
	var parseMashup = function(){};
	
	/** @todo create a method to check if string is a variable in the js code */
	var addApp=function(string, appVar, appId, config){
		var openAppCmtPos = string.indexOf('//open apps');
		if(openAppCmtPos === -1){//need to add one
			var firstOpenAppStr = getOpenAppStrings(string);
			if(firstOpenAppStr){
				var pos = string.indexOf(firstOpenAppStr[0]);
				string = string.slice(0, pos)+'\n//open apps\n'+string.slice(pos, string.length);
			}else{
				string = '//open apps'+string;
			};
			openAppCmtPos = string.indexOf('//open apps');
		};
		console.log(openAppCmtPos);
		if(appVar.length > 0){
			return string+'\nvar '+appVar+' = qlik.openApp(\''+appId+'\', '+JSON.stringify(config)+');';
		}else{
			return string;
		}
	};
	/**
	* retrieves all found apps and return the app with the given ID 
	* @param {string} appId
	* @param {string} string - the js code
	* @returns {object} the "app" object with methods and all
	*/
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
	/**
	* retrieves all found apps and return the app with the given variable name 
	* @param {string} appVar
	* @param {string} string - the js code
	* @returns {object} the "app" object with methods and all
	*/
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
	/**
	* retrieves all found apps	
	* @param {string} string - the js code
	* @returns {array} the "apps" with all apps
	*/
	var findApps = function(string){
		var apps = [];
		var strings = getOpenAppStrings(string);
		strings.forEach(function(str){
			var appId = findAppId(str, string);			
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
			var last_char = str.substring(str.length-1,str.length);
			if(last_char==='.'){
				//console.log('we have a promise');
				//findMethodPromise(str, string);
			}
			var method = getMethod(str);
			methods.push(method);
		});
		return methods;
	};
	/** @todo get method promise */
	var findMethodPromise = function(methodString, string){
		//console.log(methodString);
	};
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
		findVarValue:findVarValue,
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
