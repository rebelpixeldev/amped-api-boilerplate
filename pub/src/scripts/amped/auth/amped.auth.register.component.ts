import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'amped-register-form',
  template: `
    <md-card>
         <md-card-header>
            <md-card-title><h1>Register</h1></md-card-title>
         </md-card-header>
         <md-card-content>
            <amped-form [data]="formData" [saveLabel]="btnLabel" (onSubmit)="onSubmit($event)"></amped-form>
            <p>
              Already have an account? <a [routerLink]="['/login']">Login</a>
            </p>
         </md-card-content>
      </md-card>
    `
})
export class AmpedAuthRegisterComponent implements OnInit {
  
  public btnLabel : string = 'Register';
  
  private formData: any = {
    action: '/register',
    method : 'POST',
    fields: [
      [
        { type: 'text', label: 'First Name', name: 'first_name', required: true },
        { type: 'text', label: 'Last Name', name: 'last_name', required: true }
      ],
      [
        { type: 'text', label: 'Email', name: 'email', required: true }
      ],
      [
        { type: 'password', label: 'Password', name: 'password', required: true }
      ]
    ]
  };
  
  constructor(private router : Router) {
    console.log(this.btnLabel);
  }
  
  ngOnInit() { }
  
  onSubmit(resp : any){
    console.log('WAT?');
    console.log(resp);
    if ( resp.success )
      this.router.navigateByUrl('/dashboard');
      
  }
  
}
