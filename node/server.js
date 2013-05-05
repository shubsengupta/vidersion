// server.js
// servers and and saves content

GLOBAL.express = require("express");

// Setup
var app = express();
app.listen(process.env.PORT || 3000);

// Configuration
app.configure(function() {});

// Routes
app.get("/", function(request, response) {
	response.send("Hello World");
});

app.get("/get", function(request, response) {
	getClient(function(client, done) {
		client.query("SELECT * FROM comments WHERE video_id = $1", [request.query.id], function(err, result) {
			console.log(err);
			console.log(result);
			if (!err) {
				if (request.query.callback) {
					response.jsonp(result.rows);
				} else {
					response.json(result.rows);
				}
			} else {
				response.json({
					"error": "You suck!"
				});
			}
			done();
		});
	});
});

app.get("/put", function(request, response) {
	var id = request.query.video_id,
		start_t = request.query.start_t,
		end_t = request.query.end_t,
		text = request.query.text,
		state = request.query.state,
		comment_id = request.query.comment_id;
	getClient(function(client, done) {

		if (comment_id) {
			client.query("UPDATE comments SET state = $1 WHERE comment_id = $2", [state, comment_id], function(err, result) {
				console.log(err);
				if (!err) {
					response.json({
						"success": "You did it!"
					});
				} else {
					response.json({
						"error": "You suck!"
					});
				}
				done();
			});
		} else {
			client.query("INSERT INTO comments (video_id, start_timecode, end_timecode, text, state) VALUES ($1, $2, $3, $4, $5);", [id, start_t, end_t, text, state], function(err, result) {
				console.log(err);
				if (!err) {
					response.json({
						"success": "You did it!"
					});
				} else {
					response.json({
						"error": "You suck!"
					});
				}
				done();
			});
		}

	});
});

function getClient(callback) {
	var pg = require('pg');
	pg.connect(process.DATABASE_URL || {
		user: "mvlsltponhsgdf",
		password: "XiRHuytIsIk58G0Qwnqogxf6_9",
		database: "dv0s8vvkii6ct",
		host: "ec2-54-235-155-40.compute-1.amazonaws.com",
		post: 5432,
		ssl: true
	}, function(err, client, done) {
		if (!err) {
			callback(client, done);
		} else {
			done();
			callback(null);
		}
	});
}