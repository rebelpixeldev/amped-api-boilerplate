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
          <form>
          <md-input placeholder="Username">
            <span md-suffix>
              <md-icon>account_circle</md-icon>
            </span>
          </md-input>
          <md-input placeholder="Password">
            <span md-suffix>
              <md-icon>lock</md-icon>
            </span>
          </md-input>
          <button md-raised-button color="primary" type="submit">Login</button>
            <!--<button md-raised-button type="submit" name="login" class="login loginmodal-submit" value="Login" color="primary"></button>-->
				  </form>
				  
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
