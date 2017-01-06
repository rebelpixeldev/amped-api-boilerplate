import { Component, OnInit } from '@angular/core';

import { AmpedService } from '../../common/amped.common.service';

@Component({
    moduleId: module.id,
    selector: 'amp-account-users',
    template: `
      <div class="flex-header">
          <h1>Users on your account</h1>
          <button md-raised-button color="primary" amp-invite-user-dialog>
            <md-icon>person</md-icon> <span>Invite a user</span>
          </button>
      </div>
      <md-card>
        <amped-table [data]="userData" enableCrud="false" showFilter="false" showPagination="false"></amped-table>
      </md-card>
    `
})
export class AccountUsersComponent implements OnInit {
  
  private userData : any = [];
  
    constructor(private ampedService : AmpedService) { }

    ngOnInit() {
  
      this.ampedService.get('/api/users/account')
        .then(( resp : any ) => this.userData = resp.response )
      
    }
    
    onAddUser(){
    }
    
}
