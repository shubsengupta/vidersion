//call on enter with startTime
function addComment(startTime){

	var comment = document.getElementById("comment-input").value;

 	var video = document.getElementById("main-video");
 	var endTime = video.currentTime;

	var popcorn = Popcorn( "#main-video" );
 	popcorn.footnote({
     start: startTime,
     end: endTime,
     target: "curAnnotations",
     text: comment
   	});


}
