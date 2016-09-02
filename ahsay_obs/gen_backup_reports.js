/* usage: phantomjs gen_backup_reports.js http://<URL_OF_OBS> username password YYYY-MM-DD */

function login(u,p){	
    page.switchToFrame("obs");

	/* for log in */
	page.switchToFrame(1);
 	page.evaluate(function(u,p) { // system password

		document.getElementsByTagName("input")[0].value = u;
		document.getElementsByTagName("input")[1].value = p;
		document.getElementsByTagName("input")[2].click();
    },u,p);	
    console.log("login success");
}

function manageLogPage(){	
	page.switchToChildFrame(2);
	page.switchToChildFrame(0);
	page.evaluate(function() {
		document.getElementsByTagName('a')[0].click();
	});	
	console.log("clicked manageLogPage ");
}

function backupJobPage(){
	page.switchToMainFrame();
	page.switchToFrame(2);
	page.switchToChildFrame(0);

	page.evaluate(function() {
		document.getElementsByClassName("adminmenu_item")[1].click();
	});
	console.log("clicked backupJobPage ");
}

function selectDate(){
	page.switchToMainFrame();

	page.switchToFrame(2);
	page.switchToChildFrame(1);	
	
	var yyyymmdd = system.args[4];	
	
	/* for select Date (YYYY-MM-DD) */
	page.evaluate(function(yyyymmdd) {
		var sel = document.getElementsByName('showDate')[0];
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("change", false, true);
		//console.log(document.getElementsByTagName("option")[0].value);
		//sel.selectedIndex = 3; // 2 can gen more
		document.getElementsByName('showDate')[0].value = yyyymmdd;
		sel.dispatchEvent(evt);
		
		return document.getElementsByName('showDate')[0].value;
		
	},yyyymmdd)	
	console.log("selected Date: "+ yyyymmdd);		
}

function genReports(){	
	var date = page.evaluate(function() {		
		return document.getElementsByName('showDate')[0].value;		
	},'date')	
	
	var links = page.evaluate(function() {

		var as = document.querySelectorAll("a");
		var results = [];
		var match = "showBackupReportFull";			

		var j = 0;
		for(var i=0; i<as.length; i++){				
			if(as[i].href.indexOf(match) !== -1 ){
				results[j] = as[i].href;
				j++;
			}
		}

		return results;
	}, 'links');
	
	/*	***********************TESTING*********************** */
	var filename = page.evaluate(function() {		
		//return document.getElementsByName('adminlog_value2')[0].value;
		var bFullName = [];
		var rows = document.getElementsByTagName("table")[1].rows;			
		
		var i = 0;
		for(var row=2; row<rows.length-1; row++){
			var status = rows[row].cells[6].getElementsByTagName("font")[0].innerHTML; // Job Status
			if(status!=="Missed Backup"){
				var bname = rows[row].cells[2].getElementsByTagName("a")[0].innerHTML; // job name
				var bset = rows[row].cells[2].getElementsByTagName("td")[3].innerHTML; // bak set
				bFullName[i] = bname + " " + bset;
				i++;
			}
		}
		
		return bFullName;				
	},"filename");
	
	/* print out the report's URLs */
	//for(var i=0; i<links.length; i++){
		//console.log(links[i]);
	//}	

	/* open the reports URL one by one and save to PDF */
	console.log("there should be "+links.length+" reports");
	
	/* following RenderUrlsToFile func copied in https://github.com/ariya/phantomjs/blob/master/examples/render_multi_url.js */
	RenderUrlsToFile = function(urls, callbackPerUrl, callbackFinal) {
    var getFilename, next, report, retrieve, urlIndex, webpage;
    urlIndex = 0;
    webpage = require("webpage");
    report = null;
    getFilename = function() {
        //return "Report " + urlIndex + " " + date +".png";
        return urlIndex + "."+filename.shift() + date +".pdf";
    };
    next = function(status, url, file) {
        report.close();
        callbackPerUrl(status, url, file);
        return retrieve();
    };
    retrieve = function() {
        var url;
        if (urls.length > 0) {
            url = urls.shift();
            urlIndex++;
            report = webpage.create();
            report.settings.dpi = 300; // http://www.a4papersize.org/a4-paper-size-in-pixels.php
            report.viewportSize = {
                width: 2480,
                height: 3508
            };
            report.paperSize = {
				width: 2480 + 'px',
				height: 3508 + 'px',
				margin: 4 + 'px'
			};
            report.settings.userAgent = "Phantom.js bot";
            return report.open(url, function(status) {
                var file;
                file = getFilename();
                if (status === "success") {					
                    return window.setTimeout((function() {					
						report.render(file);
						return next(status, url, file);						
                    }), 200);					
                } else {
                    return next(status, url, file);
                }
            });
        } else {
            return callbackFinal();
        }
    };
    return retrieve();
	};

	RenderUrlsToFile(links, (function(status, url, file) {
		if (status !== "success") {
			return console.log("Unable to render '" + url + "'");
		} else {
			//return console.log("Rendered '" + url + "' at '" + file + "'");
			return console.log("Rendered: " + file);
		}
	}), function() {
		return phantom.exit();
	});
		
}

var webPage = require('webpage');
var page = webPage.create();

var system = require('system');
var link = system.args[1]; //http://obs.xxxxx.com/

/* for console.log in evaluate function */
page.onConsoleMessage = function(msg) {
	console.log(msg);
}

page.open(link, function(status) {
	var uname = system.args[2];
	var passwd = system.args[3];
	//console.log(uname+" "+passwd);
	
	/* login obs web interface */
	login(uname,passwd);

	/* for click "Manage Log" */		
	window.setTimeout(manageLogPage, 1000);

	/* for click "Backup Job" */	
	window.setTimeout(backupJobPage, 2000);

	/* select date */	
	window.setTimeout(selectDate, 3000);

	/* gen reports */		
	window.setTimeout(genReports, 4000);	
	
	//window.setTimeout(function (){
		//console.log("screenshot here and then exitdllllm");
		//page.render('vafbk.png');

		////phantom.exit();
	//}, 6000);

});

