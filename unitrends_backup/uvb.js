/* unitrends virtual backup */
/* usage: phantomjs uvb.js http://<UVB>/accounts/login/ username password */

var webPage = require('webpage');
var page = webPage.create();
var system = require('system');

page.onConsoleMessage = function(msg) {
  console.log(msg);
}

page.open(system.args[1], function(status) {	  
	page.viewportSize = { width: 1440, height: 8000 };
	var uname = system.args[2];
	var passwd = system.args[3];
	  
	page.evaluate(function(uname,passwd) {		
		document.getElementById('id_username').value = uname;
        document.getElementById('id_password').value = passwd;
        document.getElementsByClassName('btn')[0].click();	
	},uname,passwd);
	  
	window.setTimeout(function (){
		page.evaluate(function() {
			document.getElementsByClassName('clearfix')[5].click();
			
		});		
	}, 4000); // 4 seconds maximum timeout
	 

 	window.setTimeout(function (){
		//page.reload();			
		// this.click('#jobs-history');
		//this.clickLabel('jobs-history','a');
		page.evaluate(function() {
			document.getElementById('ui-id-3').click();				
		})
	}, 10000); 

	window.setTimeout(function (){
		console.log("screenshot here and then exit");
		page.render('bak.png');

		phantom.exit();
	}, 15000);
	  
});

