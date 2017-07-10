const Hapi = require('hapi');
const Inert = require('inert');
const IO = require('socket.io');

const server = new Hapi.Server();
server.connection({port: 4000});

var io = require('socket.io')(server.listener);

server.register([Inert], (err) => {

    if (err) {
        throw err;
    }

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: function(request, reply) {
                reply.file('./index.html');
            }
        }
    ]);
});

io.on('connection', function(socket) {
    socket.broadcast.emit('hi');
    socket.on('chat message', function(msg) {
        console.log('message: '+ msg);
        io.emit('Ziko Shokai', msg);
    });
    /* socket.on('disconnect', function() {
        console.log('user disconnected');
    }); */
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
