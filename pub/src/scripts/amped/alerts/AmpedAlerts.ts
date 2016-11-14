import { Injectable, Component } from '@angular/core';

import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent } from 'angular2-modal';

interface AlertParamsInterface {
  title : string,
  body : string,
  okLabel : string,
  size : string,
  showClose : boolean,
  okOk : Function,
  onCancel : Function
}

@Injectable()
export class AmpedAlertsPrompts{
  
  constructor(public modal: Modal){
    
  }
  
  confirm(data : any = {}){
  
    const params : any  = Object.assign({
      title : 'Are you sure?',
      body : '',
      okLabel : 'Yes',
      size : 'sm',
      showClose : true,
      onOk : function(){},
      onCancel : function(){}
    }, data);
    
    const modal =
      this.modal.confirm()
        .size(params.size)
        .title(params.title)
        .showClose(params.showClose)
        .okBtn(params.okLabel);
    
    if( params.body === '' )
      modal.dialogClass('amped-alerts-confirm-no-body');
    else
      modal.body(params.body);
        
        
    modal.open()
      .catch((args) => {
          console.log('MODAL catch error', args);
      })
      .then(dialog => dialog.result)
      .then((dialog) => {
        params.onOk(dialog);
      })
      .catch(params.onCancel);
    
    
      // .title('A simple Alert style modal window')
      // .open();
  }
  
  custom(){
    this.modal.open(AmpedAlertsCustomModal, new AmpedAddnewModalData(''));
  }
  
}




export class AmpedAddnewModalData extends BSModalContext {
  constructor(public model : string) {
    super();
  }
}

@Component({
  selector: 'add-mew-modal-content',
  template: `
      <div class="container-fluid custom-modal-container">
            <div class="row custom-modal-header">
                <div class="col-sm-12">
                    <h1>Add New {{context.model}}</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <amped-crud-form [params]="params"></amped-crud-form>
                </div>
            </div>
        </div>
  `
})
export class AmpedAlertsCustomModal implements ModalComponent<AmpedAddnewModalData> {
  context: AmpedAddnewModalData;
  
  params : any;
  
  constructor(public dialog: DialogRef<AmpedAddnewModalData>) {
    this.context = dialog.context;
    console.log('CONTEXT', this.context);
    this.params = { model : 'users'}
  }
  
  beforeDismiss(): boolean {
    return true;
  }
  
  beforeClose(): boolean {
    return true;
  }
}


