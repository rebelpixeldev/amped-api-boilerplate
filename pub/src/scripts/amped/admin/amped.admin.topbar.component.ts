import {Component, OnInit} from '@angular/core';

import { AmpedService } from '../common/amped.common.service';

@Component({
  moduleId: module.id,
  selector: 'amped-topbar',
  templateUrl: 'templates/amped.admin.topbar.component.html'
})
export class AmpedTopbar implements OnInit {


  private user : any = {};


  constructor(private ampedService: AmpedService) {}

  ngOnInit() {
    this.ampedService.getUser()
      .then( (user:any) => {// @TODO apply User interface to type
        this.user = user;
      });
  }

}
