import {Component, OnInit, TRANSLATIONS} from '@angular/core';

import { AmpedService } from './amped/common/amped.common.service';
@Component({
  moduleId: module.id,
  selector: 'homepage',
  template: `
    <h1>Dashboard</h1>
      <div class="dashboard-full-width-graph flex-row">
        <md-card>
          <md-card-title>Recent Activity Graphed</md-card-title>
          <amp-chart-line [data]="activityData" socketEvent="ACTIVITY_CREATE"></amp-chart-line>
        </md-card>
      </div>
      <md-card>
        <md-card-title i18n>Recent Activity</md-card-title>
        <!--@TODO You need to pass the model so the headers are properly mapped. Thats stupid-->
        <amped-table [data]="activityData" [headers]="activityHeaders" actionsEnabled="false" model="activity"></amped-table>
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
