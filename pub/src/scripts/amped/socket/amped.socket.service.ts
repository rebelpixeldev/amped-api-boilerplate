import {Injectable} from "@angular/core";

import * as io from 'socket.io-client';

@Injectable()
export class AmpedSocketService{

  private count : number = 0;
  private socket : any = null;
  
  private listeners : any = {};

  // @TODO write a better error message
  constructor(){
    if ( this.socket !== null )
      throw new Error('SocketService should only be initialized once in your AppModule. So do that... ')
    this._connect();
  }
  
  // @TODO replace with an obeservable
  public addSocketListener(evt : string, callback : Function){
    if ( typeof this.listeners[evt] === 'undefined') {
      this.listeners[evt] = [];
      this.socket.on(evt, this._handleSocket.bind(this, evt));
    }
    this.listeners[evt] = [...this.listeners[evt], callback];
  }

  private _connect(){
    this.socket = io();

    this.socket.on('create', (data : any) => {
        console.log(data);
    })
    console.log(this.socket);
  }
  
  private _handleSocket(evt : string, data : any){
    this.listeners[evt].forEach( ( func : Function ) => func(data));
    console.log('AHNDLE SOCKET', arguments);
  }
  
}
