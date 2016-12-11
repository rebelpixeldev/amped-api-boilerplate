import {Component, OnInit} from '@angular/core';

import { AmpedService } from './amped/common/amped.common.service';
@Component({
  moduleId: module.id,
  selector: 'homepage',
  template: `
      
      <md-card>
        <md-card-title>Dashboard</md-card-title>
        <md-card-subtitle>Recent Activity</md-card-subtitle>
        <amped-table [data]="activityData" enableCrud="false"></amped-table>
      </md-card>
    

`
})
export class HomepageComponent implements OnInit {
  
  private activityData : any = [];
  private user : any = {};
  
  constructor(private ampedService : AmpedService) {
  }
  
  ngOnInit() {
    this.ampedService.getUser()
      .then( (user:any) => this.user = user); // @TODO apply user type
    this.ampedService.get('/api/activity')
      .then((resp : any) => {
          this.activityData = resp.response;
      })
    
  }
  
}
