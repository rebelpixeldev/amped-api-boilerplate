//@TODO this doens't belong here

import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {AmpedSocketService} from '../socket/amped.socket.service';
@Component({
  moduleId: module.id,
  selector: 'amp-user-thumb',
  template: `
    <span *ngIf="src === ''" >
        <span class="default-avatar" [style.backgroundColor]="defaultAvatarBackground">{{getLetter()}}</span>
    </span>
    <span *ngIf="src !== ''">
      <img md-card-avatar [src]="src" />
    </span>
    {{namePrefix}} {{user.display_name}}  
      

    `
})
export class AmpedUserThumb implements OnInit, OnChanges {
  
  @Input() namePrefix : string = '';
  @Input() user : any; // @TODO make the typed to an interface
  
  private src : string = '';
  private defaultAvatarBackground : string = '';
  private defaultAvatarColor : string = '';
  
  constructor(private socketService : AmpedSocketService) {
  }

  
  ngOnInit() {
    this.socketService.getObservable('USERS_UPDATE').subscribe((payload : any) => {
      if ( payload.user.id === this.user.id )
        this.user = payload.user;
    });
  }
  
  ngOnChanges(changes : any){
    if ( typeof changes.user !== 'undefined' ){
      this.src = this.user === null ||
                  this.user === 'undefined' ||
                  typeof this.user.upload === 'undefined' ||
                  this.user.upload === null ?
                    '' : this.user.upload.thumb_url;
      this.defaultAvatarBackground = this.getColor();
    }
  }
  
  getLetter() : string{
    return typeof this.user.display_name === 'undefined' ? '' : this.user.display_name[0].toUpperCase();
  }
  
  getColor() : string{
    const str = this.user.email;
    console.log(str, this.user);
    
    if ( typeof this.user.email === 'undefined' ) {
      return 'rgba(0,0,0,0)';
    } else {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      let colour = '#';
      for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
      }
      return colour;
    }
  }
}
