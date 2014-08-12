
var HTTPUtils 			= getInnerService("HTTPUtils");

var LoginService		= getInnerService("LoginService");

var MailScrapController	= getInnerController("MailScrapController");

var DOMHandler			= getInnerController("DOMHandler");

var MailService			= getInnerService("MailService");

var request 			= getModule("request-promise");

var ngDI 				= getModule("ng-di");

var cheerio 			= getModule("cheerio");

var Promise 			= require('bluebird');

var util	 			= require('util');

var spinner 			= require('simple-spinner');

var container 			= ngDI.module("Application", []);

var Socks5ClientHttpAgent = require('socks5-http-client/lib/Agent');

var readline 			= require('readline-sync');

function Configuration(){

	var services = [
		HTTPUtils,
		LoginService,
		MailScrapController,
		DOMHandler,
		MailService
	];

	this.init = function appInit(){

		container.factory("httpService", function(){
			return request.defaults({
				jar : true,
				agent : new Socks5ClientHttpAgent({socksHost: 'localhost', socksPort: 8888})
			});
		});

		container.service("config", function(){
			return require("../../config.json");
		});

		container.factory("domWrapper", function(){
			return cheerio;
		});

		container.service("LoadingIndicator", function(){
			return spinner;
		});

		container.service("Asker", function(){
			return readline;
		});

		container.service("util", function(){
			return util;
		});

		container.factory("Promise", function(){
			return Promise;
		});

		services.forEach(function(service){
			container.service(service.name, service);
		});

		container.run(function(MailScrapController){
			MailScrapController.scrap();
		});

		// container.run(function(MailService){
		// 	MailService.send({
		// 		subject : 'whjfd',
		// 		text : "fgdg"
		// 	});
		// });

		ngDI.injector(['Application']);
	}
}

function getInnerService(name){
	return require.call(null, ["../Services/", name, ".js"].join(""));
}

function getInnerController(name){
	return require.call(null, ["../Controller/", name, ".js"].join(""));
}

function getModule(name){
	return require.call(null, name);
}

module.exports = new Configuration();