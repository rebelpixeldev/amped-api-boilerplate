import {Component, OnInit, Input, ElementRef, ViewChild} from "@angular/core";
import {MdSnackBarConfig} from "@angular/material";

export class AmpAlertSnack{
  @Input() message : string = '';
  @Input() actionLabel : string = '';
  @Input() containerRef : any = null;
  
  private alertClass : string = 'amp-alert-snack';
  
  @ViewChild('container') elem : any;
  
  get containerClass() : string{
    return '';
  }
  
  get icon() : string { return ''}
  
  get template() : string {
    return `
        ${this.message}
        <button md-button>${this.actionLabel}</button>
      </span>
    `;
  }
  
  constructor( ) {
    
  }
  
  ngAfterViewInit() {
    this.elem.nativeElement.parentElement.parentElement.classList.add(this.containerClass);
    this.elem.nativeElement.parentElement.parentElement.classList.add(this.alertClass);
  }
}


@Component({
  moduleId: module.id,
  selector: 'amp-alert-snack-success',
  template: '<md-icon>check</md-icon><span #container [innerHTML]="template"></span>'
})
export class AmpAlertSnackSuccess extends AmpAlertSnack {
  get containerClass() : string{ return 'success'; }
  get icon() : string { return 'check' }
  
}

@Component({
  moduleId: module.id,
  selector: 'amp-alert-snack-error',
  template: '<md-icon>error</md-icon><span #container [innerHTML]="template"></span>'
})
export class AmpAlertSnackError extends AmpAlertSnack {
  get containerClass() : string{ return 'error'; }
  get icon() : string { return 'error' }
}
