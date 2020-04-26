var express = require('express');
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

// app.get("/", function(req, res) {
	// res.sendFile(__dirname + "/index.html");
// });
app.use(express.static('public'));

app.get("/source/index.js", function(req, res) {
	res.sendFile(__dirname + "/source/index.js");
});

app.get("/hotOrNot", function(req, res) {
	res.sendFile(__dirname + "/compare/index.html");
});

io.on("connection", function(socket) {

	socket.on("user_join", function (data) {
		console.log(data)
		this.username = data.username;
		this.roomId = data.roomId;
		socket.broadcast.emit("user_join" + this.roomId, this.username);
	});
	
	socket.on("start_typing", function (data) {
		console.log('startd typing',data)
		socket.broadcast.emit("show_typing" + data.roomId, data.username);
	})
	
	socket.on("stop_typing", function (data) { 
		console.log('startd typing',data)
		socket.broadcast.emit("noShow_typing" + data.roomId, data.username);
	})

	socket.on("chat_message", function(data) {
		console.log(this.username, 'heeloo',this.roomId)
		data.username = this.username;
		console.log('datais', data)
		socket.broadcast.emit("chat_message" + data.roomId, data);
	});

	socket.on("disconnect", function(data) {
		socket.broadcast.emit("user_leave" + this.roomId, this.username);
	});
	
});

http.listen(port, function() {
	console.log("Listening on *:" + port);
});