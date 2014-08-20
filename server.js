var port = process.env.PORT || 8080
var io = require('socket.io').listen(port);

var clients = {};

io.sockets.on('connection', function (socket) {
	socket.on('join', function(username, friends){
		socket.join(username);
		clients[username] = username;
		socket.username = username;
		console.log("join: " + username);
		/*
		for(i in friends){
			socket.to(friends[i]).emit('user_online', username);
		}
		/*/
		io.sockets.emit('user_online', socket.username);
		/**/
	});
	
	socket.on("send_message_to", function(to_username, message) {
		socket.to(to_username).emit('message', message);
		console.log("send message to: " + to_username);
		console.log(message);
	});
	
	socket.on("get_users_online", function(usernames){
		var online = {};
		for(i in usernames) {
			if(clients[usernames[i]]){
				online[usernames[i]] = 'online';
			}
		}
		console.log("get_users_online");
		console.log(usernames);
		console.log(online);
		socket.emit('users_online', online);
	});
	
	socket.on('disconnect', function () {
		console.log('disconnect');
		delete clients[socket.username]
		io.sockets.emit('user_disconnected', socket.username);
		console.log(clients);
	});
});