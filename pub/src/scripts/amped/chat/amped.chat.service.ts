import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AmpedService} from "../common/amped.common.service";

@Injectable()
export class AmpedChatService {
  
  private chatStorageKey : string = 'amp-active-chats';
  private notify = new Subject<any>();
  
  public observable = this.notify.asObservable();
  public conversations : Array<any> = [];
  
  constructor( private ampedService: AmpedService ) {
    
  }
  
  private _getStorage(){
    return JSON.parse(localStorage.getItem(this.chatStorageKey) || '[]');
  }
  
  private _setStorage( val : Array<Object> = null ){
    if ( val !== null )
      this.conversations = val;
    localStorage.setItem(this.chatStorageKey, JSON.stringify(this.conversations.map(( i : any ) => i.id )));
    this.notify.next(this.conversations);
  }
  
  startChat(id : number){
    this.ampedService.getUser()
      .then((user : any) => {
        this.ampedService.post('/api/conversations', {
          started_by : user.id,
          account_id : user.account_id
        }, {}, true)
          .then((resp : any) => {
          this._setStorage([...this.conversations, resp.response]);
          })
      })
  }
  
  
  closeChat(id : any){
    this.conversations = this.conversations.filter(( item : any ) => {
      console.log(item);
      return item.id !== id
    } );
    this._setStorage();
  }
  
  getConversations(){
    return new Promise((resolve, reject) => {
      this.ampedService.getUser()
        .then((user : any) => {
          this.ampedService.get(`/api/conversations?account_id=${user.account_id}&in=${JSON.parse(localStorage.getItem('amp-active-chats') || '[]').join(',')}`)
            .then((resp : any ) => { // @TODO interface
                this.conversations = resp.response;
                this.notify.next(this.conversations);
                resolve(resp.response)
            })
            .catch(reject);
        });
    });
  }
  
  getConversationMessages(conversation : number){
      return this.ampedService.get(`/api/messages?conversation=${conversation}&order=ASC`);
  }
  
  sendMessage(message : string, conversation : number){
    new Promise((resolve, reject) => {
        this.ampedService.getUser()
          .then((user:any) => {
              
              const data = {
                message,
                source : 'local',
                sent_by : user.id,
                conversation_id : conversation
              };
              
              this.ampedService.post(`/api/messages`, data, {}, true)
                .then(resolve)
                .catch(reject);
          })
    })
  }
  
  
}
