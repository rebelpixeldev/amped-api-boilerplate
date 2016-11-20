import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'amped-resetpassword-form',
  template: `
				<md-card>
           <md-card-header>
              <md-card-title><h1>Reset your password</h1></md-card-title>
           </md-card-header>
           <md-card-content>
              <form>
              <md-input placeholder="Email">
                <span md-suffix>
                  <md-icon>email</md-icon>
                </span>
              </md-input>
              <button md-raised-button color="primary" type="submit">Reset</button>
                <!--<button md-raised-button type="submit" name="login" class="login loginmodal-submit" value="Login" color="primary"></button>-->
              </form>
           </md-card-content>
        </md-card>
    `
})
export class AmpedAuthResetComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
}
