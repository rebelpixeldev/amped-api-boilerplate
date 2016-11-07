import { Component } from '@angular/core';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'my-app',
    template:
      `<amped-topbar></amped-topbar>
        <div class="app-wrapper">
          <div class="sidebar amped-container">
              <ul>
                <li><a href="/">Home</a></li>
              </ul>
          </div>
          <div class="app-content-container amped-container">
              <router-outlet></router-outlet>
          </div>
        </div>
      
      `
})
export class AppComponent {
  
  public formData : Object = {};
    
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
  
  constructor(){}
  
}
