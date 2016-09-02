/* supermicro server IPMI page sensors data */
/* usage: phantomjs status.js http://<IMPI_IP> username password */

var page = require('webpage').create();	
var system = require('system');

page.open(system.args[1], function(status) { 
	/* for console.log in evaluate function */
	page.onConsoleMessage = function(msg) {
		console.log(msg);
	}	

	console.log("Status: " + status);

	var uname = system.args[2];
	var passwd = system.args[3];

	if(status === "success") {
	page.evaluate(function(uname,passwd) {	
		document.getElementById("login_username").value=uname;
		document.getElementById("login_password").value =passwd;
		document.getElementById("LOGIN_VALUE_1").click();
	},uname,passwd);
	//page.reload();

	window.setTimeout(function (){
		console.log(page.framesName);
		page.switchToFrame('header');
		page.evaluate(function() {
			document.getElementById("STR_TOPNAV_SERVER_HEALTH").click();
		});

		page.reload();
		//console.log(page.framesName);
	}, 2000); // 4 seconds maximum timeout

	window.setTimeout(function (){		
		//page.switchToParentFrame
		console.log("after click:");
		console.log(page.framesName);
		page.switchToFrame('mainFrame');
		
		//page.evaluate(function() {
		//	document.getElementByClassName("inputButton3X")[0].click();
		//});
		page.evaluate(function() {
			document.getElementsByClassName("inputButton3X")[0].click();
		});
	}, 6000); // 4 seconds maximum timeout

	window.setTimeout(function (){
		console.log("screenshot here and then exit");
		page.render('health_status.png');

		phantom.exit();
	}, 10000);
	}
	else{
		phantom.exit();
	}
});

