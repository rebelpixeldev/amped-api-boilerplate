import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'amped-resetpassword-form',
  template: `
      <div class="loginmodal-container">
					<h1>Reset password for your account</h1><br>
				  <form>
					<input type="text" name="email" placeholder="Email">
					<input type="submit" name="login" class="login loginmodal-submit" value="Reset">
				  </form>
				</div>
    `
})
export class AmpedAuthResetComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
}
