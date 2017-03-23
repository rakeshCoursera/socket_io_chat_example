const Hapi = require('hapi');
const Inert = require('inert');
const Jquery = require('jquery');
// const IO = require('socket.io');

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
            path: '/vendor/{path*}',
            handler: {
                directory: {
                    path: 'bower_components',
                    listing: false,
                    index: false
                }
            }
        }, {
            method: 'GET',
            path: '/',
            handler: function(request, reply) {
                reply.file('./index.html');
            }
        }
    ]);
});

io.on('connection', function(socket) {
    // console.log('A user connected');
    socket.on('chat message', function(msg) {
        io.emit('chat message: ' + msg);
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
