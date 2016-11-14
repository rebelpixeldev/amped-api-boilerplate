import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'amped-register-form',
  template: `
      <div class="loginmodal-container">
					<h1>Create An Account</h1><br>
				  <form (submit)="onFormSubmit()">
            <input type="text" name="name" placeholder="Name">
            <input type="text" name="user" placeholder="Email">
            <input type="password" name="pass" placeholder="Password">
            <input type="submit" name="login" class="login loginmodal-submit" value="Create">
				  </form>
				</div>
    `
})
export class AmpedAuthRegisterComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
  onFormSubmit(){
    
  }
  
}
