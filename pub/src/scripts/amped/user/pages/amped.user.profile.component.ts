import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AmpedService} from "../../common/amped.common.service";

import {AmpUserCard} from '../amped.user.card';

@Component({
  moduleId: module.id,
  selector: 'amp-user-profile',
  templateUrl: '../templates/profile.html'
})
export class UserProfileComponent implements OnInit {
  
  private user: any = {}; // @TODO needs type
  private userActivityData : any = [];
  
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
