import {Component, OnInit, Directive, HostListener, EventEmitter, Output} from '@angular/core';
import {MdDialogRef, MdDialog, MdDialogConfig} from "@angular/material";

@Directive({ selector: '[amp-files-dialog]' })
export class FilesDialogDirective {

  @Output() onFileSelect : EventEmitter<any> = new EventEmitter();

  dialogRef: MdDialogRef<FileLibraryDialog>;

  private dialogOptions : MdDialogConfig;

  constructor(public dialog: MdDialog) {
    this.dialogOptions = new MdDialogConfig();
  }

  @HostListener('click') onClick() {
    this.openDialog();
  }

  openDialog() {
    this.dialogRef = this.dialog.open(FileLibraryDialog, this.dialogOptions);

    (this.dialogRef.componentInstance as FileLibraryDialog).onFileSelect.subscribe((data : any) => {
      this.onFileSelect.emit(data);
    });

    this.dialogRef.afterClosed().subscribe(result => {
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
      <amp-media-library (onFileSelect)="fileSelected($event)"></amp-media-library>
    </div>`
})
export class FileLibraryDialog implements OnInit {

  public onFileSelect : EventEmitter<any> = new EventEmitter();

  constructor(public dialogRef: MdDialogRef<FileLibraryDialog>) {
  }

  closeDialog(){
    this.dialogRef.close();
  }

  fileSelected(data : any){
    this.onFileSelect.emit(data);
    this.closeDialog();
  }

  ngOnInit() {
  }

}
