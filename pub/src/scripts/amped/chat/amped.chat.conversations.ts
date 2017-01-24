import { Component, OnInit } from '@angular/core';
import {AmpedChatService} from "./amped.chat.service";

@Component({
    moduleId: module.id,
    selector: 'amp-conversations',
    template: `
      <amp-chat-window *ngFor="let convo of conversations" [conversation]="convo"></amp-chat-window>
    `
})
export class AmpConversationsComponent implements OnInit {
  
  private conversations : Array<Object> = [];
  
    constructor( private chatService : AmpedChatService ) { }

    ngOnInit() {
      this.chatService.getConversations();
      
      // this.chatService.getConversations()
      //   .then((resp : any) => {
      //     this.conversations = resp.response;
      //   })
      
      this.chatService.observable.subscribe((conversation) => {
          this.conversations = conversation;
      })
      
    }
    
}
