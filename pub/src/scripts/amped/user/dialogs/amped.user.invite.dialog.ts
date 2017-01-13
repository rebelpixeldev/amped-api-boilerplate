import {Component, OnInit, Directive, HostListener, EventEmitter, Output} from '@angular/core';
import {MdDialogRef, MdDialog, MdDialogConfig} from "@angular/material";

@Directive({ selector: '[amp-invite-user-dialog]' })
export class InviteUserDialogDirective {
  
  @Output() onFileSelect : EventEmitter<any> = new EventEmitter();
  
  private dialogRef: MdDialogRef<InviteUserDialog>;
  
  private dialogOptions : MdDialogConfig;
  
  constructor(public dialog: MdDialog) {
    this.dialogOptions = new MdDialogConfig();
    this.dialogOptions.width = '400px'
  }
  
  @HostListener('click') onClick() {
    this.openDialog();
  }
  
  openDialog() {
    console.log('opening dialog');
    this.dialogRef = this.dialog.open(InviteUserDialog, this.dialogOptions);
    
    // (this.dialogRef.componentInstance as InviteUserDialog).onFileSelect.subscribe((data : any) => {
    //   this.onFileSelect.emit(data);
    // });
    
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
  }
}


@Component({
  moduleId: module.id,
  selector: 'amp-invite-user-dialog',
  template: `
    <div class="flex-header">
        <h3>Send an Invitation</h3>
    </div>
    <amped-form [data]="formData" saveLabel="Invite" saveLabelActive="Sending Invitation" (onSubmit)="onInvite($event)"></amped-form>
  `
})
export class InviteUserDialog implements OnInit {
  
  private formData : any = {
    action: '/user/invite',
    method : 'POST',
    fields: [
      [
        {
          type: 'text',
          label: 'Name',
          name: 'name',
          icon: 'account_circle',
          required : true
        }
      ],
      [
        {
          type: 'text',
          label: 'Email',
          name: 'email',
          icon: 'account_circle',
          required : true
        }
      ]
    ]
  };
  
  constructor(public dialogRef: MdDialogRef<InviteUserDialog>) { }
  
  ngOnInit() { }
  
  onInvite(data : any){
    console.log(data);
    
    this.dialogRef.close();
  }
  
}

//
// @Component({
//   moduleId: module.id,
//   selector: 'files-dialog',
//   template: `
//     <div>
//       <md-icon (click)="closeDialog()">close</md-icon>
//       <amp-media-library (onFileSelect)="fileSelected($event)"></amp-media-library>
//     </div>`
// })
// export class FileLibraryDialog implements OnInit {
//
//   public onFileSelect : EventEmitter<any> = new EventEmitter();
//
//   constructor(public dialogRef: MdDialogRef<FileLibraryDialog>) {
//   }
//
//   closeDialog(){
//     this.dialogRef.close();
//   }
//
//   fileSelected(data : any){
//     this.onFileSelect.emit(data);
//     this.closeDialog();
//   }
//
//   ngOnInit() {
//   }
//
// }
