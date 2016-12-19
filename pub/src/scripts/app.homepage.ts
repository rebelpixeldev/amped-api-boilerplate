import {Component, OnInit, TRANSLATIONS} from '@angular/core';

import { AmpedService } from './amped/common/amped.common.service';
@Component({
  moduleId: module.id,
  selector: 'homepage',
  template: `
    <h1>Dashboard</h1>
      <div class="dashboard-full-width-graph">
        <md-card>
          <md-card-title>Recent Activity Graphed</md-card-title>
          <amp-chart-line [data]="activityData" socketEvent="ACTIVITY_CREATE"></amp-chart-line>
          </md-card>
        </div>
      <md-card>
        <md-card-title i18n>Recent Activity</md-card-title>
        <amped-table [data]="activityData" [headers]="activityHeaders" actionsEnabled="false"></amped-table>
      </md-card>
    

`
})
export class HomepageComponent implements OnInit {
  
  private activityData : any = [];
  private user : any = {};
  
  private activityHeaders : Object = {
    user : 'user.display_name',
    action : 'action',
    description : 'description',
    data : 'data',
    date : 'created_at'
  }
  
  constructor(private ampedService : AmpedService) {
    console.log(TRANSLATIONS);
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
