google.charts.load('current', { packages: ['corechart'] });


//global variable for storing the ids of articles currently shown in author analytics page
var articlesShown = [];

var allArticleTitles = [];
var allArticletitlesWithRevisions = [];

//chart otpions
var options = {
	'fontName':'Avenir',
	'backgroundColor': {
		fill:'#F3F3F3', 
		strokeWidth:10, 
		stroke:'#CE953F'
	},
	'bar': {groupWidth: "70%"},
	'width': '100%',
	'height': 500,

	'hAxis':{
		showTextEvery:1, 
		maxAlternation:1, 
		minTextSpacing:1, 
		textStyle:{
			fontSize:11,
			bold:true,
		},

	},
	'legend': { 
		position: 'top', 
		alignment:'center' 
	},

	'vAxis': {
        viewWindowMode: 'pretty',
        viewWindow: {
          min: 0,
        },
        gridlines: {
          count: 9,
        }
      }
};

var pieData
var barData

//Onload function
window.onload = function () {

	getOverviewPage(); //loads overview page by default

	//when menu links are clicked, other pages can be loaded
	$('#ArticleAnalytics').click(function () {
		resetMenuBar();
		$('#ArticleAnalytics').addClass("active");
		getArticleAnalyticsPage();

		
	})

	$('#AuthorAnalytics').click(function () {
		resetMenuBar();
		$('#AuthorAnalytics').addClass("active");
		getAuthorAnalyticsPage();

		
	})

	$('#Overview').click(function () {
		resetMenuBar();
		$('#Overview').addClass("active");
		getOverviewPage();
	})

}



/********************************
 FUNCTIONS FOR LOADING MAIN PAGES
 ********************************/






//Replaces entire page with article analytics
function getArticleAnalyticsPage() {

	$('#main').empty();
	$('#main').load('views/articleAnalytics.html', null, function () {
		fillAutocomplete();
		$('#articleSearchButton').click(function () {
			getIndividualArticleStats();
			
		})
	})

}

function getOverviewPage() {

	$('#main').empty(); //Clear page
	$('#main').load('views/overview.html', null, function () { //load overview page

		//Intial Data load
		getTopRevs();
		getBotRevs();
		getOldestArticles();
		getNewestArticles();
		getTitleLargestRegUser();
		getTitleLeastRegUser();


		//get chart data
		$.getJSON('/pieData', null, function (rdata) {
			pieData = rdata
		}
		);
		$.getJSON('/barData', null, function (rdata) {
			barData = rdata
			drawBar('#myChart');
		}
		);

		//Update based on user input
		$('[name=topBotRevUpdate]').click(function () {
			getTopRevs();
			getBotRevs();
		});
		$('[name=chartUpdate]').click(function () {
			var whichChart = $('[name=chartSelector]').val();
			if (whichChart == "In Total") {
				drawPie('#myChart');
			} else {
				drawBar('#myChart');
			}
		});

	});

}

function getAuthorAnalyticsPage() {
	$('#main').empty();
	$('#main').load('views/authorAnalytics.html', null, function () {
		$('#authorSearchButton').click(function () {
			getAuthorArticleList();
		})
	});

}

//clears the .active class from the menu bar
function resetMenuBar() {

	$('#Overview').removeClass("active");
	$('#ArticleAnalytics').removeClass("active");
	$('#AuthorAnalytics').removeClass("active");

}



/******************
LOAD THE CHART DATA
*******************/




function drawPie(where) {
	console.log(where)
	graphData = new google.visualization.DataTable();
	graphData.addColumn('string', 'Element');
	graphData.addColumn('number', 'Percentage');
	$.each(pieData, function (key, val) {
		graphData.addRow([key, val]);
	})
	var chart = new google.visualization.PieChart($(where)[0]);
	chart.draw(graphData, options);
}

function drawBar(where) {
	graphData = new google.visualization.DataTable();
	graphData.addColumn('string', 'Year');
	graphData.addColumn('number', 'RegularUsers');
	graphData.addColumn('number', 'Bots');
	graphData.addColumn('number', 'Admins');
	graphData.addColumn('number', 'Anon');
	var test = [];
	for (var i in barData) {
		test.push(barData[i])
	}
	// console.log(test);
	for (var x = 0; x < test.length; x++) {
		graphData.addRow([test[x].Year, test[x].RegularUsers, test[x].Bots, test[x].Admins, test[x].Anon]);
	}
	var chart = new google.visualization.ColumnChart($(where)[0]);
	chart.draw(graphData, options);
}

function drawBarSpecificUser(where, dataToUse) {
	graphData = new google.visualization.DataTable();
	graphData.addColumn('string', 'Year');
	graphData.addColumn('number', 'Revisions');
	var test = [];
	for (var i in dataToUse) {
		test.push(dataToUse[i])
	}
	// console.log(test);
	for (var x = 0; x < test.length; x++) {
		graphData.addRow([test[x].Year, test[x].Revisions]);
	}
	var chart = new google.visualization.BarChart($(where)[0]);
	chart.draw(graphData, options);
}




/*******************************************
FUNCTIONS FOR LOADING REGULAR DATA INTO HTML
********************************************/






function getTopRevs() {

	var quantity = $('[name=quantity]').val();

	var destination = 'getTopRevs?quantity=' + quantity;

	$.get(destination, quantity, function (data) {
		$('#topRev').empty();
		for (var x = 0; x < data.length; x++) {
			var num = x + 1;
			num = num + '. ';
			var appendMe = $('<li>' + num + data[x]._id + '</li>');
			$('#topRev').append(appendMe);
		}
	})
}


function getBotRevs() {

	var quantity = $('[name=quantity]').val();

	var destination = 'getBotRevs?quantity=' + quantity;

	$.get(destination, quantity, function (data) {
		$('#botRev').empty();
		for (var x = 0; x < data.length; x++) {
			var num = x + 1;
			num = num + '. ';
			var appendMe = $('<li>' + num + data[x]._id + '</li>');
			$('#botRev').append(appendMe);
		}
	})
}

function getOldestArticles() {

	var destination = 'getOldestArticles';

	$.get(destination, null, function (data) {
		console.log(data);
		$('#oldestArticles').empty();
		for (var x = 0; x < data.length; x++) {
			var num = x + 1;
			num = num + '. ';
			var appendMe = $('<li>' + num + data[x]._id + '</li>');
			$('#oldestArticles').append(appendMe);
		}
	})
}

function getNewestArticles() {

	var destination = 'getNewestArticles';
	console.log('here');

	$.get(destination, null, function (data) {
		console.log(data);
		$('#newestArticles').empty();
		for (var x = 0; x < data.length; x++) {
			var num = x + 1;
			num = num + '. ';
			var appendMe = $('<li>' + num + data[x]._id + '</li>');
			$('#newestArticles').append(appendMe);
		}
	})
}

function getTitleLargestRegUser(){

	var destination = 'getLeastRegoUser';

	$.get(destination, null, function (data) {
		console.log(data);
		$('#mostUsers').empty();
		$('#mostUsers').text(data);
	})
}


function getTitleLeastRegUser(){

	var destination = 'getLargestRegoUser';

	$.get(destination, null, function (data) {
		console.log(data);
		$('#leastUsers').empty();
		$('#leastUsers').text(data);
	})
}
function getAuthorArticleList() {

	var authorName = $('#authorEntryBox').val();

	console.log(authorName)

	var destination = 'getAuthorArticleList?authorName=' + authorName;

	var putListHere = $('#articleList');

	$.get(destination, null, function (data) {
		console.log('Here is the user list ')
		console.log(data)
		if (data.length == 0) {
			alert("Could not find any users with names matching that query");
		} else {
			// var heading = $('<thead><tr>' + '<th>' + 'Article Name' + '</th>' + '<th>' + 'Number of Revisions' + '</th>' + '</tr></thead><tbody>')
			// $('#articleList').append(heading);
			// for (var x = 0; x < data.length; x++) {
			// 	var test = "<tr onclick='getTimestamps()' id= '" + "ArticleNameIs" + data[x]._id + "'>" + "<td>" + data[x]._id + "</td>" + '<td>' + data[x].count + '</td>' + '</tr>';
			// 	var appendMe = $("<tr onclick='getTimestamps()' id= '" + "ArticleNameIs" + data[x]._id + "'>" + "<td>" + data[x]._id + "</td>" + '<td>' + data[x].count + '</td>' + '</tr>');
			// 	console.log(test)
			// 	$('#articleList').append(appendMe);
			// }
			// var ending = $('</tbody>');
			// $('#articleList').append(ending);
			putListHere.empty();

			//Add headers
			var theader = $("<thead><tr><th>User Name</th><th>Article Name</th><th>Number of Revisions</th></tr></thead>")
			$('#articleList').append(theader);

			//Create data table
			for (var x = 0; x < data.length; x++) {
				var appnedMe = $("<tr class='articleEntry' id= '" + "entryID" + x + "'>" + '<td>' + data[x].user + '</td>' + "<td>" + data[x]._id + "</td>" + '<td>' + data[x].count + '</td>' + '</tr>');
				$('#articleList').append(appnedMe);
				var temp = '#entryID' + x;
				// $(temp).click(function(x){ //Get timestamps
					
				// 	console.log(x)
				// })
				
			}

			//Create event handler seperately
			function handleEvent(idVal){
				var elementGetter = '#entryID' + idVal;
				$(elementGetter).click(function(){
					$(".timestamp").remove();
					console.log(elementGetter)
					var newdestination = 'getTimestamps?authorName=' + data[idVal]._id + "&title=" + data[idVal].user;
					$.get(newdestination, null, function (newdata) {
						console.log(newdata)
						for(var z = 0; z < newdata.length; z++){
							var myDate = new Date(newdata[z].timestamp)
							console.log(myDate)
							$('<tr><td class="timestamp">' + "    " + myDate.toUTCString() + '</td></tr>').insertAfter(elementGetter);
						}
					})
				})
			}

			for(var x = 0; x < data.length; x++){
				handleEvent(x)
			}

		}

	})

}



function fillAutocomplete() {
	var destination = 'getAllArticleTitles'
	$.get(destination, null, function (data) {
		$('#articleEntryList').empty();
		for (var x = 0; x < data.length; x++) {
			console.log(data[x])
			var appendMe = $('<option>' + data[x]._id + " [revisions: " + data[x].count + ']</option>')
			$('#articleEntryList').append(appendMe);
			allArticleTitles[x] = data[x]._id;
			allArticletitlesWithRevisions[x] = data[x]._id + ' [Total Revisions: ' + data[x].count + ']';
		}
	})
}


function getIndividualArticleStats() {



	//Get article name

	var searchedArticle = $('#articleEntryBox').val();
	var temp = searchedArticle.split("[");
	temp = temp[0];
	if (temp.substring(temp.length - 1, temp.length) == " ") {
		temp = temp.substring(0, temp.length - 1);
	}
	searchedArticle = temp;

	var validTitle = false;

	//check if this is a valid article
	for (var n = 0; n < allArticleTitles.length; n++) {
		if (searchedArticle == allArticleTitles[n]) {
			validTitle = true;
		}
	}
	
	//Convert article string to be used with wiki link
	searchQuery = searchedArticle.replace(/\s+/g, '_');

	//Retrieve last timestamp from DB
	var sendTitle = 'getLastTime?title=' + searchedArticle

		$.ajax({
					url: sendTitle,
					type: 'GET',
					global: false,
					dataType: 'json',

					success: function(data) {
 					lastTS = data;

 					//AJAX within an AJAX
 					var wikiEndpoint = "https://en.wikipedia.org/w/api.php",

				    parameters = [ "action=query",
				    "format=json",
				    "formatversion=2",
				    "prop=revisions", 
				    "titles="+searchQuery, 
				    "rvstart="+lastTS, 
				    "rvdir=newer",
				    "order=desc",
				    "rvlimit=max",

				    //Only querying for timestamps
				    "rvprop=timestamp", 
				    "origin=*",
				    "callback=?"]
					var url = wikiEndpoint + "?" + parameters.join("&");
					console.log(url);

					//Get data from MediaWiki API
					$.ajax({
							url: url,
							type: 'GET',
							dataType: 'jsonp',
							contentType: "application/json; charset=utf-8",
				        	success: function(data, jqXHR) {
				 	
				 			page=data.query.pages;
				 			revs = page[Object.keys(page)[0]].revisions

				 			//Retrieve latest timestamp from the array
				 			latestTS = revs[Object.keys(revs).length-1].timestamp 

				 			//Moment.js library to compare dates
							var diff = moment.duration(moment(latestTS).diff(moment(lastTS)));

							//Date conversions
							var days = parseInt(diff.asDays()); 
							var hours = parseInt(diff.asHours()); 
							adjustedHours = hours - days*24;  
							var minutes = parseInt(diff.asMinutes()); 
							minutes = minutes - (days*24*60 + adjustedHours*60); 
							
							console.log(searchQuery+": "+days+" days "+adjustedHours+" hours " + minutes +" minutes");
							console.log("Latest: "+latestTS);
							console.log("Database: "+lastTS);

							//Displays number of revisions if available
				 			if (hours<24) {

				 			$("#wasIUpdated").empty();
							$("#wasIUpdated").text("No new revisions!");

								
								} else {
							
							$("#wasIUpdated").empty();
							$("#wasIUpdated").text("Update available: " +revs.length + " revisions");
							}

				 			
				        	}
						})
					}
			})

	



	if (!validTitle) {
		alert("There are no articles with this title (titles are case sensitive)");
	} else {

		//check if any data is being returned
		//Add if statement with alert in case of an incorrect title

		//Display article name
		$("#putTitleHere").empty();
		var newTitle = searchedArticle.trim();
		for(var c = 0; c < allArticleTitles.length; c++){
			var toTest = allArticleTitles[c].trim();
			if(newTitle == toTest){
				newTitle = allArticletitlesWithRevisions[c];
			}
		}
		$("#putTitleHere").text(newTitle);


		//Add in title and class of table
		$("putTopRegUsersHeading").empty();
		$("#putTopRegUsersHeading").text("Top Users For " + searchedArticle);

		$("#putClassHere").addClass("longtable");


		//Add in charts
		$("#putChartTitleHere").text("Graphs");

		//Get chart data and draw charts
		var destination2 = 'pieDataIndividualArticle?title=' + searchedArticle
		$.getJSON(destination2, null, function (rdata) {
			pieData = rdata
		}
		);
		var destination3 = 'barDataIndividualArticle?title=' + searchedArticle
		$.getJSON(destination3, null, function (rdata) {
			barData = rdata
			drawBar('#IndividualArticleChart'); //default chart
		}
		);


		//Draws the chart controls and add the top 5 users to the table
		var chartControls = $.get('views/chartControls.html', null, function (data) {
			appendMe = $(data)
			$('#putChartControlsHere').empty();
			$('#putChartControlsHere').append(appendMe);
			//Add in top 5 users to both the chart above and the select list
			var destination = 'getTopUsersForArticle?title=' + searchedArticle
			$.get(destination, null, function (data) {
				console.log(data)
				$('#putTopRegUsers').empty();
				for (var x = 0; x < data.length; x++) {
					var ranking = x + 1;
					ranking = ranking + '. '
					var appendMe = $('<li>' + ranking + data[x]._id + ' (revisions: ' + data[x].count + ')' + '</li>');
					$('#putTopRegUsers').append(appendMe);
					appendMe = $('<option value=' + data[x]._id + '>' + data[x]._id + '</option>');
					$('#putUsersHere').append(appendMe)
				}
			})
			//Registers event handler for update button
			$('#chartSwitcherIndividualArticle').click(function () {
				//get value from select box
				var specificUser = $('#chartSelectorIndividualArticles').val();
				if (specificUser == "In Total") {
					drawPie('#IndividualArticleChart');
				} else if (specificUser == "Over Time") {
					drawBar('#IndividualArticleChart');
				} else {
					var destination4 = 'barDataSpecificUser?user=' + specificUser + '&title=' + searchedArticle
					$.getJSON(destination4, null, function (rdata) {
						console.log('here it is...')
						console.log(rdata)
						drawBarSpecificUser('#IndividualArticleChart', rdata);
					}
					);
				}
			})
		})


	}

}



