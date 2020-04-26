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

	socket.on("user_join", function(data) {
		console.log(data)
		this.username = data.username;
		this.roomId = data.roomId;
		socket.broadcast.emit("user_join" + this.roomId, data.username);
	});

	socket.on("chat_message", function(data) {
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