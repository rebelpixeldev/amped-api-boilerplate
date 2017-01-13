import {Component, OnInit, Input, OnChanges} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'amp-async-button',
  template: `
      <button md-raised-button color="{{color}}" [disabled]="asyncActive || disabled ">
        <ng-content></ng-content>
        {{ asyncActive ? labelActive : label }}<amp-spinner *ngIf="asyncActive"></amp-spinner>
      </button>
    `
})
export class AsyncButtonComponent{
  @Input() disabled : boolean = false;
  @Input() asyncActive : boolean = false;
  @Input() color : string = 'primary';
  
  @Input() label : string = 'Button';
  @Input() labelActive : string = 'Working';
  
}
