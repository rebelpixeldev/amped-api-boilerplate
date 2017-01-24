import {Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {AmpedChatService} from "./amped.chat.service";
import {AmpedSocketService} from "../socket/amped.socket.service";

@Component({
  moduleId: module.id,
  selector: 'amp-chat-window',
  template: `
        <md-card [ngClass]="{'collapsed' : mimimized}">
         <md-card-header>
            <md-card-title>Header title</md-card-title>
            <!--<md-card-subtitle>Header subtitle</md-card-subtitle>-->
            <span class="fill-remaining-space"></span>
            <div class="amp-chat-window-controls">
                <button md-icon-button *ngIf="!mimimized" (click)="mimimized = true">
                  <md-icon>remove</md-icon>
                </button>
                <button md-icon-button *ngIf="mimimized" (click)="mimimized = false">
                  <md-icon>add</md-icon>
                </button>
                <button md-icon-button (click)="chatService.closeChat(conversation.id)">
                  <md-icon>clear</md-icon>
                </button>
                <button md-icon-button [md-menu-trigger-for]="menu">
                  <md-icon>more_vert</md-icon>
                </button>
            </div>
            <md-menu #menu="mdMenu">
              <a (click)="downloadTranscript()" md-menu-item>
                <md-icon>file_download</md-icon>Get Transcript 
              </a>
            </md-menu>
         </md-card-header>
         <md-card-content>
            <div class="amp-chat-message-display" #chatMessageDisplay>
                 <amp-chat-message [data]="message" *ngFor="let message of messages"></amp-chat-message>
            </div>
            <div class="amp-chat-form">
                <textarea [(ngModel)]="message" (keydown)="onMessageKeyDown($event)"></textarea>
                <button md-raised-button color="primary" (click)="sendMessage()">Send</button>
            </div>
         </md-card-content>
      </md-card>
      
    `
})
export class AmpedChatWindowComponent implements OnInit, OnChanges {
  @Input() conversation : any = null;
  @Input() mimimized : boolean = false;
  
  @ViewChild('chatMessageDisplay') messageDisplay : HTMLElement;
  
  private message : string = '';
  
  private messages : any = []; // @TODO create interface
  
  constructor(public chatService : AmpedChatService, private socketService : AmpedSocketService) {
  }
  
  ngOnInit() {
    this.getMessages();
    
    this.socketService.getObservable('MESSAGES_CREATE')
      .subscribe((payload : any) => {
        if( parseInt(payload.data.conversation_id) === this.conversation.id )
          this.setMessages([...this.messages, payload.data]);
      });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
      this.getMessages();
  }
  
  getMessages(){
    if ( this.conversation !== null )
      this.chatService.getConversationMessages(this.conversation.id)
        .then((resp : any ) => { //@TODO api resp interface
          this.setMessages(resp.response);
          
        });
  }
  
  downloadTranscript(){
    alert('Coming soon');
  }
  
  onMessageKeyDown(evt : KeyboardEvent){
    if ( evt.code === 'Enter' || evt.code === 'NumpadEnter' ) {
      this.sendMessage();
      return false;
    }
  }
  
  setMessages(val : any){
    this.messages = val;
    setTimeout(() => {
      this.messageDisplay.nativeElement.scrollTop = this.messageDisplay.nativeElement.scrollHeight;
    }, 1);
    
  }
  
  sendMessage(){
    console.log(this.message);
    console.log(this.message);
    console.log(this.conversation);
    this.chatService.sendMessage(this.message, this.conversation.id);
    this.message = '';
  }
  
}
