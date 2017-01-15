import {Component, OnInit, OnDestroy} from '@angular/core';

import {Router, ActivatedRoute} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'amped-login-form',
  template: `
    <md-card>
       <md-card-header>
          <md-card-title><h1>Amped Login</h1></md-card-title>
       </md-card-header>
       <md-card-content>
       
          <amped-form [data]="formData" [saveLabel]="btnLabel" (onSubmit)="onLogin($event)"></amped-form>
				  <span class="or"><span>OR</span></span>
				  
				  <a (click)="loginGoogle()" class="btn btn-primary" md-raised-button color="primary">Login with Google</a>
				  <a (click)="loginFacebook()" class="btn btn-facebook" md-raised-button color="primary">Login with Facebook</a>
					
				  <div class="login-help">
					  <a routerLink="/register">Register</a> - <a routerLink="/passwordreset">Forgot Password</a>
				  </div>
       </md-card-content>
    </md-card>

    `
})
export class AmpedAuthLoginComponent implements OnInit {
  
  private sub: any;
  private redirect: string;
  
  private btnLabel : string = 'Login';
  
  private formData : any = {
    action: '/login',
    method : 'POST',
    fields: [
      [
        {
          type: 'text',
          label: 'Email',
          name: 'email',
          icon: 'account_circle'
        }
      ],
      [
        {
          type: 'password',
          label: 'Password',
          name: 'password',
          icon: 'lock'
        }
      ]
    ]
  };
  
  constructor(private activeRoute: ActivatedRoute, private router: Router) {
  }
  
  ngOnInit() {
    this.sub = this.activeRoute.params.subscribe((params: any) => this.redirect = params.redirect);
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  
  loginGoogle() {
    const loginWindow = window.open('/auth/google?redirect=' + this.redirect);
  }
  
  loginFacebook() {
    console.log('@TODO Login with Facebook');
  }
  
  //@TODO give data response type
  onLogin(data : any){
    localStorage.setItem('token', data.response.token);
    window.location.href = '/';
    //noinspection TypeScriptUnresolvedFunction
    // window.onLogin(data);
  }
  
}