

function LoginService(HTTPUtils, DOMHandler, LoadingIndicator, config){

	var DEFAULT_UI = config.homepage;
	var DEFAULT_HOST = config.baseUrl;
	var HOME = 'm_HomeView';
	var MAIL_BOX = 'm_MailView';
	var LOGIN = config.loginAPI;

	var ULTRA_LIGHT = 'UltraliteUrlPathName={LOGIN}';

	this.login = function doLogin(user, password){

		LoadingIndicator.stop();
		console.log("Logging " + user);

		LoadingIndicator.start();
		return HTTPUtils.getPage(DEFAULT_HOST + DEFAULT_UI.replace("{user}", user) + HOME).then(function(page){
			var form = DOMHandler.handleLogin(page);

			form.Username = user;
			form.Password = password;
			form.RedirectTo = DEFAULT_UI.replace("{user}", user);

			this.loggedUser = user;

			return HTTPUtils.post(DEFAULT_HOST + LOGIN, form).then(function(http){

				LoadingIndicator.stop();
				console.log("Logged " + user);
				console.log("Fetching homepage");
				LoadingIndicator.start();


				var cookies = http.response.headers['set-cookie'].join(";");

				this.loginCookie = cookies ? ULTRA_LIGHT.replace('{LOGIN}', config.lightMode.replace('user', user)) + cookies : this.loginCookie;

				return HTTPUtils.get(this.getURL(HOME), cookies).then(function(httpHome){
					LoadingIndicator.stop();

					console.log("Homepage fetched");

					console.log("Fetching mailbox");
					
					LoadingIndicator.start();

					var cookies = httpHome.response.headers['set-cookie'].join(";");
					this.loginCookie = this.loginCookie + ";" + cookies;
					return HTTPUtils.getPage(this.getURL(MAIL_BOX), this.loginCookie);
				}.bind(this));
			}.bind(this));

		}.bind(this));
	}

	this.getURL = function getURL(suffix){
		return DEFAULT_HOST + DEFAULT_UI.replace("{user}", this.loggedUser) + suffix;
	}
}

module.exports = LoginService;