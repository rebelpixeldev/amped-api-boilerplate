import {Injectable} from "@angular/core";

import * as io from 'socket.io-client';

@Injectable()
export class AmpedSocketService{

  private count : number = 0;
  private socket : any = null;

  // @TODO write a better error message
  constructor(){
    if ( this.socket !== null )
      throw new Error('SocketService should only be initialized once in your AppModule. So do that... ')
    console.log('AMPED SOCKET CREATED');
    this._connect();
  }

  hello(){
    this.count++;
  }

  private _connect(){
    this.socket = io();

    this.socket.on('create', (data : any) => {
        console.log(data);
    })
    console.log(this.socket);
  }

}
