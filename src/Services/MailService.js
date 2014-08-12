
function MailService(DOMHandler, HTTPUtils, LoginService, Promise, config, Asker){

	var COOKIES = ';DomJSEnabled=1;DomTimeZonePrfM=+:6:Greenwich:0:0:0;';

	var nodemailer = require('nodemailer');

	if(!config.passwordSender){
		config.passwordSender = Asker.question("Whats your password for {0}?".replace("{0}", config.emailSender), {noEchoBack: true});
	}

	var transporter = nodemailer.createTransport({
	    service: config.provider,
	    auth: {
	        user: config.emailSender,
	        pass: config.passwordSender
	    }
	});

	this.getEmails = function(page){

		return DOMHandler.handleMailbox(page);
	};

	this.getEmail = function(page){
		var body  = DOMHandler.handleMailPage(page);
		var title = DOMHandler.handleMailTitle(page);

		return {
			subject : title,
			html : body
		};
	};

	this.getEmailPage = function(url){
		return HTTPUtils.getPage(url, LoginService.loginCookie + COOKIES);
	};

	this.send = function sendEmail(emailBody){
		return new Promise(function(resolve, reject){
			emailBody.from = config.emailSender;
			emailBody.to = config.emailSender;
			transporter.sendMail(emailBody, function(error, info){
			    if(error){
			        reject(error);
			    }else{
			        resolve(info);
			    }
			});			
		});
	}

}

module.exports = MailService;
