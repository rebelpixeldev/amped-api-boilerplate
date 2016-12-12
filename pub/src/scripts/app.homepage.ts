import {Component, OnInit, TRANSLATIONS} from '@angular/core';

import { AmpedService } from './amped/common/amped.common.service';
@Component({
  moduleId: module.id,
  selector: 'homepage',
  template: `
      
      <md-card>
        <md-card-title i18n>Dashboard</md-card-title>
        <md-card-subtitle i18n>Recent Activity</md-card-subtitle>
        <amped-table [data]="activityData" enableCrud="false"></amped-table>
      </md-card>
    

`
})
export class HomepageComponent implements OnInit {
  
  private activityData : any = [];
  private user : any = {};
  
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
