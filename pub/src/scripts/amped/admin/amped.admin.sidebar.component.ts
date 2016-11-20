import {Component, OnInit} from '@angular/core';

import { AmpedService } from '../common/amped.common.service';

@Component({
  moduleId: module.id,
  selector: 'amped-sidebar',
  templateUrl: 'templates/amped.admin.sidebar.component.html'
})
export class AmpedSidebar implements OnInit {
  
  private user : any = {};
  
  constructor(private ampedService: AmpedService) {}
  
  ngOnInit() {
    this.ampedService.getUser()
      .then( (user:any) => this.user = user); // @TODO apply User interface to type
  }
  
}
