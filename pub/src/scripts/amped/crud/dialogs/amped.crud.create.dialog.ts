import {Component, OnInit, Directive, HostListener, EventEmitter, Output} from '@angular/core';
import {MdDialogRef, MdDialog, MdDialogConfig} from "@angular/material";
import {BaseDialogDirective} from "../../common/baseClasses/amped.common.dialog.directive.class";
import {AmpedService} from "../../common/amped.common.service";

@Directive({ selector: '[amp-create-crud-dialog-trigger]' })
export class CreateCrudDialogDirective extends BaseDialogDirective {
  constructor(public dialog: MdDialog) {
    super(dialog);
  }
  get dialogContent(){
    return CrudCreateDialog;
  }
}


@Component({
  moduleId: module.id,
  selector: 'amp-create-crud-dialog',
  template: `
    <div class="flex-header">
        <!-- @TODO figure out how to get the model name in here. Might have to be passed from the directive above -->
        <h3>Create</h3> 
    </div>
    <amped-form [data]="formData" saveLabel="Invite" (onSubmit)="onInvite($event)"></amped-form>
  `
})
export class CrudCreateDialog implements OnInit {
  
  private formData : any; // @TODO add interface type;
  // private formData : any = {
  //   action: '/user/invite',
  //   method : 'POST',
  //   fields: [
  //     [
  //       {
  //         type: 'text',
  //         label: 'Users Email',
  //         name: 'email',
  //         icon: 'account_circle',
  //         required : true
  //       }
  //     ]
  //   ]
  // };
  
  constructor( private ampedService : AmpedService ) { }
  
  ngOnInit() {
    this.ampedService.get('/api/users/edit')
      .then(( resp : any ) => this.formData = resp.response );
  }
  
  onInvite(data : any){
    console.log(data);
  }
  
}
