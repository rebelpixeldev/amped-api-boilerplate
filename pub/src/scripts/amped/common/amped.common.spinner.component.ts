import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'amp-spinner',
    template: `
      <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
         <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    `
})
export class AmpedSpinner {
    constructor() { }

    ngOnInit() { }
    
}
