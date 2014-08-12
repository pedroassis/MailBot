

function MailScrapController(LoginService, MailService, config, Promise, LoadingIndicator){

	var username = config.email;
	var password = config.password;
	
	this.scrap = function scrap () {
		LoadingIndicator.start();

		LoginService.login(username, password).then(function(mailbox){

			LoadingIndicator.stop();

			console.log("Mailbox fetched");

			var mailCounter = 0;
			var emails = MailService.getEmails(mailbox);

			console.log("There are {0} email to be forwarded".replace("{0}", (emails.length || 0)));

			LoadingIndicator.start();
			var promises = emails.map(function(url){

				return MailService.getEmailPage(url).then(function(emailPage){

					var emailBody = MailService.getEmail(emailPage);
					return MailService.send(emailBody);					
				});
			});

			Promise.all(promises).then(function(){

				LoadingIndicator.stop();
				console.log("All email were sent.");
			}, function(){
 				
				LoadingIndicator.stop();
				console.log("Something happened: " + JSON.stringify(arguments));
			});
		});
	}
}

module.exports = MailScrapController;