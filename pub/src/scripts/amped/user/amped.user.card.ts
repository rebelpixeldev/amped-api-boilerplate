import { Component, OnInit } from '@angular/core';
import {AmpedService} from "../common/amped.common.service";

@Component({
    moduleId: module.id,
    selector: 'amp-user-card',
    template: `
      <md-card>
         <md-card-header>
            <amp-user-thumb [user]="user"></amp-user-thumb>
         </md-card-header>
         <md-card-content>
            <p>Here is some more content</p>
         </md-card-content>
      </md-card>
    `
})
export class AmpUserCard implements OnInit {
  
  private user : any = {}; // @TODO needs interface
    constructor( private ampedService : AmpedService) { }

    ngOnInit() {
      this.ampedService.getUser()
        .then(( user ) => {
          console.log(user);
          this.user = user
        });
    }
    
}
