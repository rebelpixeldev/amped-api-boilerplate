import {Component, OnInit, Input} from '@angular/core';
import {AmpedService} from "../common/amped.common.service";

@Component({
  moduleId: module.id,
  selector: 'amp-chat-message',
  template: `
      <div [ngClass]="{'my-message' : didISend}">
          {{data.message}}
      </div>
        
    `
})
export class ChatMessageComponent implements OnInit {
  
  @Input() data: any = {};
  
  private didISend : boolean = false;
  
  private user : any = null; // @TODO User interface
  
  constructor(private ampedService: AmpedService) {
    this.ampedService.getUser()
      .then((user) => {
        this.user = user;
        this.didISend = this.user.id === this.data.sent_by;
      })
  }
  
  ngOnInit() {
    
    
  }
  
}
