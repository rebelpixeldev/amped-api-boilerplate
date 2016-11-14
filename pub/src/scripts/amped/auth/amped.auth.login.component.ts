import {Component, OnInit, OnDestroy} from '@angular/core';

import {Router, ActivatedRoute} from '@angular/router';
import {cpus} from "os";

@Component({
  moduleId: module.id,
  selector: 'amped-login-form',
  template: `
      <div class="loginmodal-container">
					<h1>Login to Your Account</h1><br>
				  <form>
					<input type="text" name="user" placeholder="Username">
					<input type="password" name="pass" placeholder="Password">
					<input type="submit" name="login" class="login loginmodal-submit" value="Login">
				  </form>
				  
				  <hr> OR
				  
				  <a (click)="loginGoogle()" class="btn btn-primary"><i class="fa fa-google-plus" aria-hidden="true"></i>Login with Google</a>
				  <a (click)="loginFacebook()" class="btn btn-facebook"><i class="fa fa-facebook" aria-hidden="true"></i>Login with Facebook</a>
					
				  <div class="login-help">
					<a routerLink="/register">Register</a> - <a routerLink="/passwordreset">Forgot Password</a>
				  </div>
				</div>
    `
})
export class AmpedAuthLoginComponent implements OnInit {
  
  private sub : any;
  private redirect : string;
  
  constructor(private activeRoute: ActivatedRoute, private router : Router) {
  }
  
  ngOnInit() {
    this.sub = this.activeRoute.params.subscribe((params: any) => this.redirect = params.redirect);
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  
  loginGoogle() {
    console.log(this.redirect);
    const loginWindow = window.open('/auth/google?redirect=' + this.redirect);
  }
  
  loginFacebook() {
    console.log('Login with Facebook');
  }
  
}
