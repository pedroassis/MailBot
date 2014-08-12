

function DOMHandler(){

	this.handleLogin = function($){
		var form = {};
		$("form").find("input").toArray().forEach(function(i){
			var name = $(i).attr("name");
			var value = $(i).val();
			if(name){
				form[name] = value;
			}
		});
		return form;
	};

	this.handleMailbox = function($){
		return $(".mailRowArea.unread").toArray().map(function(i){
			return $(i).find('a.entryLink').attr("href");
		});
	};

	this.handleMailPage = function($){
		return $(".msgBody").html();
	};

	this.handleMailTitle = function($){
		return $("title").html();
	};
}

module.exports = DOMHandler;