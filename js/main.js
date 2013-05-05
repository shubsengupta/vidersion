var firstkey=true;
var startTime=0;

$('#comment-input').keydown(function(event) {
  if (event.keyCode >= 65 && event.keyCode <= 90) { // if a letter pressed
  	if(firstkey){
  		firstkey=false;
  		startTime = document.getElementById("main-video").currentTime;
  	}

  }
});

$("#comment-input").keyup(function(e){
  var code = (e.keyCode ? e.keyCode : e.which);
  if(code == 13) { //Enter keycode

    var comment = document.getElementById("comment-input").value;
 	var endTime = document.getElementById("main-video").currentTime;

 	console.log("Adding comment:"+comment);
 	console.log("with StartTime:"+startTime);
 	console.log("and endTime:"+endTime);

 	//TODO: need to fix.
 	//add comment to popcorn instance
	var popcorn = Popcorn( "#main-video" );

 	popcorn.footnote({
     start: 0,
     end: 5,
     target: "footnotes",
     text: comment
   	});

	//TODO:add comment to server

	//TODO:add to annotation-container

 	//reset stuff
 	startTime = 0;
	document.getElementById("comment-input").value='';
	firstkey=true;
  }
});

function getServer() {
	$.ajax({
		url: "http://vidersion.herokuapp.com/get",
		type: "GET",
		dataType: "jsonp",
		crossDomain: true,
		jsonp: "callback",
		// cache: false,
		jsonpCallback: "JSONPCallback",
		error: function(xhr, status, error) {
			console.log("error!");
			console.dir(error);
		},
		success: function(data) {
			populatePageWithData();
		}
	});
}

function populatePageWithData() {
	// THE SERVER HAS SUCCESSFULLY RETURNED THE INFO
	// DO WORK HERE!

	//add to popcorn instance

	//add to annotation-container

}