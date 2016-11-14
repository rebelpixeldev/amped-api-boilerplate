import {Component, OnInit} from '@angular/core';

import { AmpedService } from '../common/amped.common.service';

@Component({
  moduleId: module.id,
  selector: 'amped-topbar',
  templateUrl: 'templates/amped.admin.topbar.component.html'
})
export class AmpedTopbarComponent implements OnInit {
  
  private user : any = {};
  
  
  constructor(private ampedService: AmpedService) {}
  
  ngOnInit() {
    this.ampedService.getUser()
      .then( (user:any) => this.user = user); // @TODO apply User interface to type
  }
  
}
