var firstkey = true;
var startTime = 0;
var currentTime = 0;
var globalData;
var lastBoldedIndex = -1;

$('#comment-input').keydown(function(event) {
	if (event.keyCode >= 65 && event.keyCode <= 90) { // if a letter pressed
		if (firstkey) {
			firstkey = false;
			startTime = document.getElementById("main-video").currentTime;
		}

	}
});

$("#comment-input").keyup(function(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13) { //Enter keycode

		var comment = document.getElementById("comment-input").value;
		var endTime = document.getElementById("main-video").currentTime;

		//TODO: need to fix.
		//add comment to popcorn instance
		var popcorn = Popcorn("#main-video");
		popcorn.code({
			start: startTime,
			end: endTime,
			onStart: function(options) {
				$("#blue-block").html(comment);
			},
			onEnd: function(options) {
				$("#blue-block").hide();
			}
		});



		//display new comment for 2 seconds
		// Show the container
		$("#green-container").show();
		// Show the block
		$("#green-block").show();
		$("#green-block").html(comment);
		setTimeout(function() {
			getServer();
		}, 2000); // 2000 ms = 2 s


		//TODO:add comment to server

		//TODO:add to annotation-container

		//reset stuff
		document.getElementById("comment-input").value = '';
		firstkey = true;
		var startTimeAjax = startTime;

		$.ajax({
			url: "http://vidersion.herokuapp.com/put",
			type: "GET",
			dataType: 'jsonp',
			data: {
				start_t: Math.round(startTimeAjax),
				end_t: Math.floor(document.getElementById("main-video").currentTime),
				video_id: 1,
				text: comment,
				state: 'new'
			},
			crossDomain: true,
			error: function(xhr, status, error) {
				console.log("error!");
			},
			success: function(data) {
				console.log("success!");
			}
		});

		//reset stuff
		startTime = 0;
		document.getElementById("comment-input").value = '';
		firstkey = true;

	}
});

function getServer() {
	$("#green-block").hide();
	$("#green-container").hide();
	$("#blue-container").hide();
	$("#blue-block").hide();
	var popcorn = Popcorn("#main-video");
	popcorn.on('timeupdate', function(number) {
		if (Math.floor(this.currentTime()) > currentTime) {
			currentTime = Math.floor(this.currentTime());
			populatePageWithData(currentTime);
		}
	});
	$.ajax({
		url: "http://vidersion.herokuapp.com/get?id=1",
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
			globalData = data;
			populatePageWithData();
			//add to popcorn
			var popcorn = Popcorn("#main-video");
			for (var i = 0; i < globalData.length; i++) {
				popcorn.code({
					start: globalData[i]["start_timecode"],
					end: globalData[i]["end_timecode"],
					ie: i,
					onStart: function(options) {
						$("#blue-block").show();
						$("#blue-container").show();
						$("#blue-block").html(globalData[options.ie]["text"]);
						// document.getElementById("blue-block").innerHTML = globalData[options.ie]["text"];
					},
					onEnd: function(options) {
						$("#blue-block").hide();
						$("#blue-container").hide();
						// document.getElementById("blue-block").innerHTML = '';
					}
				});
			}
		}
	});
}

function populatePageWithData(currentTime) {

	//add to annotation list
	globalData.sort(function(a, b) {
		if (a.start_timecode < b.start_timecode) {
			return -1;
		} else if (a.start_timecode > b.start_timecode) {
			return 1;
		} else {
			return 0;
		}
	});

	var boldedIndex = 0;
	for (var j = 0; j < globalData.length; j++) {
		if (currentTime <= globalData[j].start_timecode) {
			boldedIndex = j - 1;
			break;
		}
	}
	if (boldedIndex < 0) {
		boldedIndex = 0;
	}
	if (lastBoldedIndex === boldedIndex) {
		return;
	} else {
		lastBoldedIndex = boldedIndex;
	}

	var content = "";
	for (var i = 0; i < globalData.length; i++) {
		var comment = globalData[i];

		if (i === boldedIndex) {
			content += '<div class="annotation old-annotation" style="opacity: 1.0 !important;">';
			content += '<strong>';
		} else {
			content += '<div class="annotation old-annotation">';
		}
		content += comment.text;
		content += '<span class="time-created" onclick="seekTo(' + comment.start_timecode + ');">';
		content += 'at ';
		content += '<a>';
		if (comment.start_timecode > 59) {
			content += Math.floor(comment.start_timecode / 60);
			content += ":";
			content += comment.start_timecode % 60;
		} else if (comment.start_timecode < 10) {
			content += "0:0" + comment.start_timecode;
		} else {
			content += "0:" + comment.start_timecode;
		}
		if (i === boldedIndex) {
			content += "</strong>";
		}
		content += '</a></span></div>';
	}
	$("#annotation-container").empty();
	$("#annotation-container").append(content);
}

function seekTo(time) {
	var endTime = document.getElementById("main-video").currentTime = time;
}