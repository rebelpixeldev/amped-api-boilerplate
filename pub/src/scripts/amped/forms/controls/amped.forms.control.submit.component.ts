import {Component, Input, OnInit} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'amped-form-submit',
  template: `
      <button type="submit" class="btn btn-primary" (click)="submitCallback()">Submit</button>
    `
})
export class FormSubmitComponent implements OnInit {
  
  @Input() submitCallback : Function;
  
  constructor() {
  }
  
  ngOnInit() {
  }
}
