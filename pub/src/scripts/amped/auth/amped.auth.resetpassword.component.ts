import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'amped-resetpassword-form',
  template: `
    <md-card>
         <md-card-header>
            <md-card-title><h1>Reset Password</h1></md-card-title>
         </md-card-header>
         <md-card-content>
            <amped-form [data]="formData" [saveLabel]="btnLabel"></amped-form>
         </md-card-content>
      </md-card>
    `
})
export class AmpedAuthResetComponent implements OnInit {
  public btnLabel : string = 'Reset';
  private formData: any = {
    action: '/',
    fields: [
      [
        { type: 'text', label: 'Email', name: 'email', required: true },
      ]
    ]
  };
  
  constructor() { }
  
  ngOnInit() { }
  
}
