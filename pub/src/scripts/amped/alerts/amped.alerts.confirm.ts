import {Component, OnInit, Directive, HostListener, EventEmitter, Output, Input} from '@angular/core';
import {MdDialogRef, MdDialog, MdDialogConfig} from "@angular/material";
import {AmpedService} from "../common/amped.common.service";
import {BaseDialogDirective} from "../common/baseClasses/amped.common.dialog.directive.class";

@Directive({ selector: `[amp-alerts-confirm-trigger]` })
export class AlertsConfirmDialogDirective extends BaseDialogDirective {
  
  @Input() data : any = {};
  
  @Input() title : string = '';
  @Input() description : string = '';
  @Input() color : string = 'primary';
  @Input() yesLabel : string = 'Yes';
  @Input() noLabel : string = 'No';
  
  @Input() onAccept : Function = function(){};
  @Input() onCancel : Function = function(){};
  
  
  constructor(public dialog: MdDialog) {
    super(dialog);
  }
  get dialogContent(){
    return AlertConfirmDialog;
  }
  
  passData(){
    this.dialogRef.componentInstance.title = this.title;
    this.dialogRef.componentInstance.description = this.description;
    this.dialogRef.componentInstance.color = this.color;
    this.dialogRef.componentInstance.yesLabel = this.yesLabel;
    this.dialogRef.componentInstance.noLabel = this.noLabel;
    this.dialogRef.componentInstance.onAccept = this.onAccept;
    this.dialogRef.componentInstance.onCancel = this.onCancel;
  }
}


@Component({
  moduleId: module.id,
  selector: 'amp-alerts-confirm',
  template: `
    <h1 md-dialog-title>{{title}}</h1>
    <p md-dialog-content>{{description}}</p>
    <!-- @TODO make buttons go to the right-->
    <div md-dialog-actions fxLayout="column-reverse">
      <button (click)="handleYesClick()" md-dialog-close md-button color="{{color}}">{{yesLabel}}</button>
      <button (click)="handleNoClick()" md-dialog-close md-button>{{noLabel}}</button>
    </div>
  `
})
export class AlertConfirmDialog implements OnInit {
  
  public data : any = {};
  public title : string;
  public description : string;
  public color : string = 'primary';
  public yesLabel : string = 'Yes';
  public noLabel : string = 'No';
  public onAccept : Function = function(){};
  public onCancel : Function = function(){};
  
  
  constructor( private dialogRef: MdDialogRef<AlertConfirmDialog> ) { }
  
  ngOnInit() {
  }
  
  handleYesClick(){
    this.onAccept(this.data);
    this.dialogRef.close('yes');
  }
  
  handleNoClick(){
    this.onCancel(this.data);
    this.dialogRef.close('no');
  }
  
}
