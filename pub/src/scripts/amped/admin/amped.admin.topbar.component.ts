import {Component, OnInit} from '@angular/core';

import { AmpedService } from '../common/amped.common.service';

@Component({
  moduleId: module.id,
  selector: 'amped-topbar',
  template: `
    <md-toolbar [color]="primary">
      <span i18n>Amped Framework</span>
      <span class="fill-remaining-space"></span>
      <div *ngIf="user !== null && user.display_name" class="">
        <amp-user-thumb [user]="user" [md-menu-trigger-for]="menu" namePrefix="{{'Welcome Back'}}"></amp-user-thumb>
        <button md-icon-button [md-menu-trigger-for]="menu">
          <md-icon>more_vert</md-icon>
        </button>
      </div>
      <!--<div *ngIf="!user.display_name">-->
        <!--<a md-raised-button routerLink="/login" href="javascript:void(0)" i18n>Login</a>-->
      <!--</div>-->
    
    </md-toolbar>
    
    
    <md-menu #menu="mdMenu">
      <a href="/#/user/profile/{{user.id}}" md-menu-item>Profile</a>
      <a (click)="handleLogout()" md-menu-item>Logout</a>
    </md-menu>
  `
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
  
  handleLogout(){
    localStorage.removeItem('token');
    window.location.href = '/'
  }

}
