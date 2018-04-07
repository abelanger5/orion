var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var http = require('http'); 
var server = http.createServer(app); 

server.listen(process.env.PORT || 3000); 
app.use(express.static('public'));

app.get('/', function(req, res) {
	res.send('index.html');  
});

var io = require('socket.io').listen(server);

console.log("listening on port 3000"); 

io.on('connection', function(socket) {
	console.log("new client connected"); 
	socket.on("key-press", function(msg) {
		console.log(msg.key); 
		//console.log(msg.top + " " + msg.left); 
	}); 
}); 