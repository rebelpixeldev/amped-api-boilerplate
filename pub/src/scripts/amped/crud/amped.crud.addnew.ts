import {Component, OnInit, Input} from '@angular/core';

import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent } from 'angular2-modal';

import { AmpedAlertsPrompts } from '../alerts/AmpedAlerts';

@Component({
  moduleId: module.id,
  selector: 'amped-add-new',
  template: `
        <button md-raised-button color="primary" (click)="onClick()">
           <i class="fa fa-plus" aria-hidden="true"></i>{{label}}
        </button>`,
  providers : [ AmpedAlertsPrompts ]
})
export class AmpedCrudAddnew implements OnInit {
  
  @Input() label : string = 'Add New';
  @Input() model : string;
  
  constructor(private modal : Modal, private prompts : AmpedAlertsPrompts) {
  }
  
  ngOnInit() {}
  
  onClick(){
    
    // this.prompts.confirm({
    //   onOk : () => {
    //       console.log('IT IS OK');
    //   }
    // });
    
    
    this.prompts.custom();
    
    // this.modal.alert()
    //   .size('lg')
    //   .showClose(true)
    //   .title('A simple Alert style modal window')
    //   .body(`
    //         <amped-crud-form [params]="params"></amped-crud-form>`)
    //   .open();
    // this.modal
    //   .open(AmpedAddnewModal, new AmpedAddnewModalData(this.model));
  }
  
}

// @TODO Make the modals more generic so there is a consistent look and feel for them.. maybe
