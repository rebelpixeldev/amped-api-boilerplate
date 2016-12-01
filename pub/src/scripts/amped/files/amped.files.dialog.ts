import {Component, OnInit, Directive, HostListener} from '@angular/core';
import {MdDialogRef, MdDialog, MdDialogConfig} from "@angular/material";

@Directive({ selector: '[amp-files-dialog]' })
export class FilesDialogDirective {
  
  dialogRef: MdDialogRef<FileLibraryDialog>;
  
  private dialogOptions : MdDialogConfig;
  
  constructor(public dialog: MdDialog) {
    this.dialogOptions = new MdDialogConfig();
  }
  
  @HostListener('click') onClick() {
    console.log('CLICK');
    this.openDialog();
  }
  
  openDialog() {
    this.dialogRef = this.dialog.open(FileLibraryDialog, this.dialogOptions);
    console.log(this.dialogRef);
    
    this.dialogRef.afterClosed().subscribe(result => {
      console.log('result: ' + result);
      this.dialogRef = null;
    });
  }
}


@Component({
  moduleId: module.id,
  selector: 'files-dialog',
  template: `
    <div>
      <md-icon (click)="closeDialog()">close</md-icon>
      <amp-media-library></amp-media-library>
    </div>`
})
export class FileLibraryDialog implements OnInit {
  constructor(public dialogRef: MdDialogRef<FileLibraryDialog>) {
  }
  
  closeDialog(){
    this.dialogRef.close();
  }
  
  ngOnInit() {
  }
  
}
