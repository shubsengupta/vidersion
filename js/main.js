//call on enter with startTime

function addComment(startTime) {

	var comment = document.getElementById("comment-input").value;

	var video = document.getElementById("main-video");
	var endTime = video.currentTime;

	var popcorn = Popcorn("#main-video");
	popcorn.footnote({
		start: startTime,
		end: endTime,
		target: "curAnnotations",
		text: comment
	});
}

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
}