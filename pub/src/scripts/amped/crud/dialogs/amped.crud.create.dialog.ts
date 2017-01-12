import {Component, OnInit, Directive, HostListener, EventEmitter, Output, Input} from '@angular/core';
import {MdDialogRef, MdDialog, MdDialogConfig} from "@angular/material";
import {BaseDialogDirective} from "../../common/baseClasses/amped.common.dialog.directive.class";
import {AmpedService} from "../../common/amped.common.service";

@Directive({ selector: '[amp-create-crud-dialog-trigger]' })
export class CreateCrudDialogDirective extends BaseDialogDirective {
  
  @Input() title : string = null;
  @Input() model : string = '';
  @Input() label : string = 'Save';
  
  constructor(public dialog: MdDialog) {
    super(dialog);
  }
  get dialogContent(){
    return CrudCreateDialog;
  }
  
  passData(){
    //@TODO figure out how to singularize the model so the title doesn't say 'Create new users' for example
    if ( this.title === null )
      this.title = `Create new ${this.model}`;
    this.dialogRef.componentInstance.title = this.title;
    this.dialogRef.componentInstance.model = this.model;
    this.dialogRef.componentInstance.label = this.label;
  }
}


@Component({
  moduleId: module.id,
  selector: 'amp-create-crud-dialog',
  template: `
    <div class="flex-header">
        <h3>{{title}}</h3> 
    </div>
    <amped-form [data]="formData" saveLabel="{{label}}" (onSubmit)="onSubmit($event)"></amped-form>
  `
})
export class CrudCreateDialog implements OnInit {
  
  public label : string;
  public title : string;
  public model : string;
  
  private formData : any = {}; // @TODO add interface type;
  
  constructor( private dialogRef: MdDialogRef<CrudCreateDialog>, private ampedService : AmpedService ) { }
  
  ngOnInit() {
    this.ampedService.get(`/api/${this.model}/edit`)
      .then(( resp : any ) => {
      this.formData = {
          action: `/api/${this.model}`,
          method : 'POST',
          fields: resp.response
        }
      } );
  }
  
  onSubmit(data : any){
    if ( data.success )
      this.dialogRef.close();
  }
  
}
