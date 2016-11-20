//@TODO this doens't belong here

import {Component, OnInit, Input} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'amp-user-thumb',
  template: `
      <img md-card-avatar [src]="user.photo.source_url" /> {{user.display_name}}

    `
})
export class AmpedUserThumb implements OnInit {
  
  @Input() user : any; // @TODO make the typed to an interface
  
  constructor() {
  }
  
  ngOnInit() {}
  
}
