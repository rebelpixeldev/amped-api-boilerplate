import {Component, OnInit} from '@angular/core';

import { AmpedService } from './amped/common/amped.common.service';
@Component({
  moduleId: module.id,
  selector: 'homepage',
  template: `Dashboard`
})
export class HomepageComponent implements OnInit {
  
  private user : any = {};
  
  constructor(private ampedService : AmpedService) {
  }
  
  ngOnInit() {
    this.ampedService.getUser()
      .then( (user:any) => this.user = user); // @TODO apply user interface
  }
  
}
