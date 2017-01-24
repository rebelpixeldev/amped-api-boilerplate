import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AmpedTopbar } from './amped/admin/amped.admin.topbar.component';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'my-app',
    template:
    // @TODO replace app-wrapper with an app component
      `
        <amped-topbar></amped-topbar>
        <div class="app-wrapper">
          <amped-sidebar [hidden]="basicLayout"></amped-sidebar>
          <div class="app-content-container amped-container">
              <router-outlet></router-outlet>
          </div>
          <amp-conversations></amp-conversations>
        </div>
      `
})
export class AppComponent {
  
  public formData : Object = {};
  
  // @ViewChild(AmpedTopbar) ampedTopbar : AmpedTopbar;
  private basicLayout : boolean = false;
    
  
  //   action : '/some/url',
  //
  //   fields : [
  //
  //     {name: 'first_name', value : ''},
  //     {name : 'provinces', value : 'Ontario', type: 'select', options : [
  //       {label : 'Ontario', value : 'Ontario'},
  //       {label : 'Alberta', value : 'Alberta'}
  //     ]}
  //
  //   ]
  //
  // }
  
  constructor(private router : Router){
    
    this.router.events.subscribe((event) => {
      this.basicLayout = event.url === '/login' || event.url === '/register' || event.url === '/passwordreset';
    });
  }
  
}
