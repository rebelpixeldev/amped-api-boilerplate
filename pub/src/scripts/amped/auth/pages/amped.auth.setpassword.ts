import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'amped-resetpassword-form',
  template: `
    <md-card>
         <md-card-header>
            <md-card-title><h1>Set Password</h1></md-card-title>
         </md-card-header>
         <md-card-content>
            <amped-form [data]="formData" [saveLabel]="btnLabel"></amped-form>
         </md-card-content>
      </md-card>
    `
})
export class AmpedAuthSetPasswordComponent implements OnInit {
  public btnLabel : string = 'Save & Login';
  private formData: any = [];
  
  constructor(private route: ActivatedRoute,) { }
  
  ngOnInit() {
  
    this.route.params.subscribe((params: any) => {
      if ( typeof params.token !== 'undefined' ) {
        this.formData = {
          action: '/setpassword',
          fields: [
            [
              { type: 'hidden', name: 'token', value: params.token, required: true }
            ],
            [
              { type: 'password', label: 'New password', name: 'new_password', required: true }
            ],
            [
              { type: 'password', label: 'Type it again', name: 'new_password_again', required: true }
            ]
          ]
        }
        // this.setHeaders();
      }
    
    });
  }
  
}
