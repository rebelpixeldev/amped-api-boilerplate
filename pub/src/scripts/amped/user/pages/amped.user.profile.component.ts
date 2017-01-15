import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AmpedService} from "../../common/amped.common.service";

import {AmpUserCard} from '../amped.user.card';

@Component({
  moduleId: module.id,
  selector: 'amp-user-profile',
  template: `
    <div class="user-profile flex-row">
      <amp-user-card></amp-user-card>
  
      <div class="user-profile-content">
        <amped-crud-form *ngIf="user.id" model="users" [id]="user.id" setFromUrl="false" hideTitle="true"></amped-crud-form>
        
        <amped-crud-form *ngIf="user.id" model="user_settings" [id]="user.id" setFromUrl="false" title="Settings"></amped-crud-form>
        
        <md-card>
          <md-card-title>Latest Activity</md-card-title>
          <amped-table [data]="userActivityData" enableCrud="false" showFilter="false" showPagination="false" model="activity"></amped-table>
        </md-card>
  
      </div>
  
  </div>
  `
})
export class UserProfileComponent implements OnInit {
  
  private user: any = {}; // @TODO needs type
  private userActivityData : any = [];
  
  // private formModel : string = ;
  
  constructor(private route: ActivatedRoute, private ampedService: AmpedService) {
  }
  
  
  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      const {id} = routeParams;
      this.ampedService.get(`/api/users/${id}`)
        .then((resp: any) => {
          this.user = resp.response;
          // @TODO really hate this.. should pass an object to .get and let the ampedService convert it to the orrect format
          this.ampedService.get(`/api/activity?user_id=${this.user.id}&limit=10`)
            .then(( resp : any ) => this.userActivityData = resp.response ); // @TODO needs type
          
        })
    })
  }
  
}
