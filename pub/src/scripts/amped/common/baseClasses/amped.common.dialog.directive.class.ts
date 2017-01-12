import {Output, EventEmitter, HostListener} from "@angular/core";
import {MdDialogRef, MdDialog, MdDialogConfig, ComponentType} from "@angular/material";

export class BaseDialogDirective {
  
  @Output() onFileSelect : EventEmitter<any> = new EventEmitter();
  
  protected dialogRef: MdDialogRef<any>;
  
  private dialogOptions : MdDialogConfig;
  
  constructor(public dialog: MdDialog) {
    this.dialogOptions = new MdDialogConfig();
    this.dialogOptions.width = '400px'
  }
  
  get dialogContent() : ComponentType<any>  {
    return null;
  }
  
  @HostListener('click') onClick() {
    this.openDialog();
  }
  
  openDialog() {
    this.dialogRef = this.dialog.open(this.dialogContent, this.dialogOptions);
    this.passData();
    
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
  }
  
  passData(){return;}
}
