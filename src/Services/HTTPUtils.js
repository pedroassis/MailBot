
function HTTPUtils(httpService, domWrapper){	
	
	this.post = function post(url, formdata){

		return httpService.post(url, {
			form : formdata
		});
	}
	
	this.get = function getPage(url, cookies){
		var options;
		if(cookies){
			options = {
				headers : {
					cookie : cookies
				}
			};
		}

		return httpService.get(url, options);
	}
	
	this.getPage = function getPage(url, cookies){
		var options;
		if(cookies){
			options = {
				headers : {
					cookie : cookies
				}
			};
		}

		return httpService.get(url, options).then(function(http){
			return domWrapper.load(http.body);
		});
	}
	
}

module.exports = HTTPUtils;