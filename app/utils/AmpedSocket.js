'use strict';

class AmpedSocket{

    constructor(io){
        this.io = io;
        this.sockets =[];
        this.setup();
    }

    setup(){
        this.io.on('connection', (socket) => {
            console.log('Connected');
            this.sockets.push(socket);
            socket.on('disconnect', () => this.sockets.slice(this.sockets.indexOf(socket), 1));
        })
    }

    sendSocket(evt, data){
        this.sockets.forEach((socket) => {
            socket.emit(evt, data)
        });
    }





}

module.exports = AmpedSocket;