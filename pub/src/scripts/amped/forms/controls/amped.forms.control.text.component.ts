import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'amped-forms-text',
  template: `
      <input 
          type="text" 
          class="form-control" 
          [(ngModel)]="model"
          (change)="this.modelChange.emit(this.model)" />
    `
})
export class FormTextComponent implements OnInit {
  
  @Input() model : String;
  @Output() modelChange: EventEmitter<String> = new EventEmitter<String>();
  
  constructor() {
  }
  
  ngOnInit() {
  }
  
}
