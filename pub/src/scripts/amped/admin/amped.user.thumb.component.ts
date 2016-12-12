//@TODO this doens't belong here

import {Component, OnInit, Input} from '@angular/core';
import {AmpedSocketService} from '../socket/amped.socket.service';
@Component({
  moduleId: module.id,
  selector: 'amp-user-thumb',
  template: `
      <img md-card-avatar [src]="user.photo.source_url" /> {{namePrefix}} {{user.display_name}}

    `
})
export class AmpedUserThumb implements OnInit {
  
  @Input() namePrefix : string = '';
  @Input() user : any; // @TODO make the typed to an interface

  constructor(private socketService : AmpedSocketService) {
  }

  ngOnInit() {
    this.socketService.addSocketListener('USERS_UPDATE', (payload : any) => {
      
      this.user = payload.data;
        // console.log('I HEARD YA', data);
      // this.user =
    })
    
  }

}
