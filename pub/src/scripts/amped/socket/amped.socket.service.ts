import {Injectable} from "@angular/core";

import * as io from 'socket.io-client';
import {Subject} from "rxjs/Subject";

@Injectable()
export class AmpedSocketService{

  private count : number = 0;
  private socket : any = null;
  
  private observables : any = {};

  constructor(){
    if ( this.socket !== null )
      throw new Error('SocketService should only be initialized once in your AppModule. So do that... ');
    this._connect();
  }
  
  public getObservable(name : string){
    if ( typeof this.observables[name] === 'undefined' ) {
      this.observables[name] = new Subject<any>();
      this.socket.on(name, this._handleSocket.bind(this, name));
    }
    return this.observables[name].asObservable();
  }

  private _connect(){
    this.socket = io(window.location.origin, {query:`authorization=${localStorage.getItem('token')}`});
    this.socket.connect();
  }
  
  private _handleSocket(evt : string, data : any){
    
    if ( typeof this.observables[evt] !== 'undefined' )
      this.observables[evt].next(data);
  }
  
}
