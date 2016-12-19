//@TODO this doens't belong here

import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {AmpedSocketService} from '../socket/amped.socket.service';
@Component({
  moduleId: module.id,
  selector: 'amp-user-thumb',
  template: `
      <img md-card-avatar [src]="src" /> {{namePrefix}} {{user.display_name}}

    `
})
export class AmpedUserThumb implements OnInit, OnChanges {
  
  @Input() namePrefix : string = '';
  @Input() user : any; // @TODO make the typed to an interface
  
  private src : string = '';
  
  constructor(private socketService : AmpedSocketService) {
  }

  
  ngOnInit() {
    
    console.log(this.user);
    
    this.socketService.addSocketListener('USERS_UPDATE', (payload : any) => {
      this.user = payload.user;
      console.log(this.user);
    })
    
  }
  
  ngOnChanges(changes : any){
    if ( typeof changes.user !== 'undefined' ){
      console.log(changes);
      this.src = this.user === null || this.user === 'undefined' || typeof this.user.upload === 'undefined' || this.user.upload === null? '' : this.user.upload.thumb_url;
      // this.user = changes.user;
    }
  }
}
