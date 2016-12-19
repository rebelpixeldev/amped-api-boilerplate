'use strict';

class AmpedSocket {

  constructor(io) {
    this.io = io;
    this.sockets = [];
    this.setup();
  }

  // @TODO group the sockets by account id
  setup() {
    this.io.on('connection', (socket) => {
      this.sockets.push(socket);
      socket.on('disconnect', () => this.sockets.slice(this.sockets.indexOf(socket), 1));
    })
  }

  // @TODO send sockets based on account_id
  sendSocket(evt, data, req) {
    // console.log('SENDING socket ect', evt, data);
    if (typeof data === 'undefined')
      data = {};
    this.sockets.forEach((socket) => {
      socket.emit(evt, data)
    });
  }


}

module.exports = AmpedSocket;
