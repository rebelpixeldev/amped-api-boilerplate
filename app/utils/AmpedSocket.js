'use strict';

class AmpedSocket {

  constructor(io) {
    this.io = io;
    this.sockets = [];
    this.setup();
  }

  /**
   * @TODO should only be allowed to be created once
   * @TODO break disconnect out to its own function
   * @TODO group the sockets by account id
   *
   * Sets up the the main connection listener for the sockets
   */
  setup() {
    this.io.on('connection', (socket) => {
      this.sockets.push(socket);
      socket.on('disconnect', () => this.sockets.slice(this.sockets.indexOf(socket), 1));
    })
  }

  /**
   * @TODO send sockets based on account_id
   *
   * @param {string} evt   - The event that should be sent
   * @param {any} data     - The data that will be sent with the socket event
   * @param {object} req   - Express request object
   */
  sendSocket(evt, data, req) {
    if (typeof data === 'undefined')
      data = {};
    this.sockets.forEach((socket) => {
      socket.emit(evt, data)
    });
  }
}

// Export the AmpedSocket class
module.exports = AmpedSocket;
