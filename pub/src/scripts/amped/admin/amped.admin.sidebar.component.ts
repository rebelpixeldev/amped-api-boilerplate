import {Component, OnInit} from '@angular/core';

import {AmpedService} from '../common/amped.common.service';

@Component({
  moduleId: module.id,
  selector: 'amped-sidebar',
  template: `
    <md-sidenav-layout>
      <md-list>
        <div class="nav-section" *ngFor="let section of navigation">
            <h3 md-subheader *ngIf="section.title && section.title.label">{{section.title.label}}</h3>
             <md-nav-list>
              <a md-list-item routerLink="{{ getNavigationLink(link.href) }}" *ngFor="let link of section.links">
                <md-icon md-list-avatar>{{ link.icon }}</md-icon>
                {{ link.label }} 
              </a>
            </md-nav-list>
            <md-divider></md-divider>
        </div>
    </md-list>
    </md-sidenav-layout>
  `
})
export class AmpedSidebar implements OnInit {
  
  private user: any = {};
  
  private navigation: any = [
    {
      links: [
        {icon: 'dashboard', label: 'Dashboard', href: '/'},
    
      ]
    },
    {
      title: {label: 'Account'},
      links: [
        {icon: 'business', label: 'Account Profile', href: '/edit/accounts/:account_id'},
        {icon: 'photo_library', label: 'Media Library', href: '/files/library'},
        {icon: 'people', label: 'Users', href: '/account/users'},
        
      ]
    },
    {
      title: {label: 'Admin'},
      links: [
        {icon: 'supervisor_account', label: 'Users', href: '/edit/users'},
        {icon: 'account_box', label: 'Accounts', href: '/edit/accounts'}
      ]
    }
  ]
  
  
  constructor(private ampedService: AmpedService) {
  }
  
  ngOnInit() {
    this.ampedService.getUser()
      .then((user: any) => this.user = user); // @TODO apply User interface to type
  }
  
  getNavigationLink(url : string){
    return url
            .replace(':account_id', this.user.account_id)
            .replace(':user_id', this.user.id);
  }
  
}
