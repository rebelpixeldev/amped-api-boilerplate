import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'amped-forms-select',
  template: `
      <select class="form-control" [(ngModel)]="model" (change)="onChange()">
        <option *ngFor="let option of options" [value]="option.value">{{option.label}}</option>
      </select>
    `
})
export class FormSelectComponent{
  
  @Input() model : String;
  @Input() options : Object;
  @Output() modelChange: EventEmitter<String> = new EventEmitter<String>();
  
  constructor() {
  }
  
  onChange(){
    console.log(this.model);
    this.modelChange.emit(this.model)
  }
  
}
