//Redis
const client = require('./redis');
module.exports = (io) =>{
    io.on('connection', function(socket){
        console.log(socket.id);
        //console.log(socket.request.session);
        io.to(socket.id).emit('email id', socket.request.session.email);
        //console.log(Object.keys(socket.request.sessionStore.sessions).length);
        console.log(socket.request.sessionStore.sessions);
        let chatroomData = {
            numberOfUsers : 0, //Number of clients connected to socket
            users : []
        }
        for(var i in socket.request.sessionStore.sessions){
            JSON.parse(socket.request.sessionStore.sessions[i]).passport.hasOwnProperty('user') ?
            chatroomData.users.push(JSON.parse(socket.request.sessionStore.sessions[i]).name):
            delete socket.request.sessionStore.sessions[i];
            //console.log(!JSON.parse(socket.request.sessionStore.sessions[i]).passport.hasOwnProperty('user'));
        }
        chatroomData.numberOfUsers = Object.keys(socket.request.sessionStore.sessions).length;
        //let numberOfUsers = io.engine.clientsCount; //Number of clients connected to socket
        //console.log(Object.keys(io.engine.clients));
        //console.log(socket.id);
        io.emit('user data', chatroomData); //Emits to clients the user data;
        //Retrieves last 100 messages stored on redis and emits to clients
        /*client.lrange('holymoly',-100,-1, function(err, data){
            if(err) {return console.log(err);}
            io.emit('chat message', data);
        });*/
        //console.log(socket.request.headers.cookie);
        //console.log(socket.request.headers);
        //console.log(socket.request.session.name);
        //console.log(socket.request.session.email);
        let username='';
        let email='';
        if(!socket.request.session.name){
            let destination = '/chatroom';
            io.emit('redirect', destination);
        }
        else {
            username = socket.request.session.name;
            email = socket.request.session.email;
        }
        console.log(`${username} connected to the socket`);
        socket.on('disconnect', () => {
            chatroomData = {
                numberOfUsers : 0, //Number of clients connected to socket
                users : []
            }
            for(var i in socket.request.sessionStore.sessions){
                //chatroomData.users.push(JSON.parse(socket.request.sessionStore.sessions[i]).name);
                JSON.parse(socket.request.sessionStore.sessions[i]).passport.hasOwnProperty('user') ?
                chatroomData.users.push(JSON.parse(socket.request.sessionStore.sessions[i]).name):
                delete socket.request.sessionStore.sessions[i];
            }
            chatroomData.numberOfUsers = Object.keys(socket.request.sessionStore.sessions).length;
            console.log(`${username} left the socket`);
            io.emit('user data', chatroomData);
        });
    
        //When message is emitted 
        socket.on('chat message', function(msg){
            var message = {
                'user':username,
                'email': email,
                'msg':msg
            }
            //Stores messages in Redis
            let message2 = JSON.stringify(message);
            //console.log(JSON.stringify(message));
            client.rpush('holymoly', message2, function(err, data) {
                if(err) {return console.log(err);}
                client.lrange('holymoly',-1,-1, function(err, data){
                    if(err) {return console.log(err);}
                    io.emit('chat message', data);
                });
            });
            //
        });
    });
}