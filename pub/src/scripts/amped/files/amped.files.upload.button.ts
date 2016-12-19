import {Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {AmpedFilesService} from './amped.files.service';
import {MdSnackBar, MdSnackBarConfig} from "@angular/material";
import {AmpedAlertService} from "../alerts/amped.alert.service";


@Component({
  moduleId: module.id,
  selector: 'amp-upload-btn',
  providers : [MdSnackBar],
  template: `
      <label>
        <button md-raised-button color="primary"   (change)="uploadFile($event)" [disabled]="uploading">
          <input [(ngModel)]="files" type="file" required multiple [disabled]="uploading" />
          {{ uploading ? 'Uploading' : 'Upload' }}<amp-spinner *ngIf="uploading"></amp-spinner>
        </button>
      </label>
    `
})
export class UploadBtnComponent implements OnInit {
  
  @ViewChild('uploadInput') input: HTMLElement;
  
  @Output() onUpload: EventEmitter<any> = new EventEmitter();
  
  public files: any = null;
  
  private uploading: boolean = false;
  
  constructor(private filesService: AmpedFilesService, private ampAlert : AmpedAlertService) {
  }
  
  ngOnInit() {
  }
  
  uploadFile(evt: any) {
    
    this.uploading = true;
    var files = evt.srcElement.files;
    const body = new FormData();
    
    for (let i = 0, len = files.length; i < len; i++) {
      body.append('files[]', files[i]);
    }
    
    // body.append('files', files);
    evt.srcElement.value = '';
    this.filesService.uploadFile(body)
      .then((resp) => {
        this.uploading = false;
        this.ampAlert.snackSuccess('', resp.response.length > 1 ? `${resp.response.length} files have been uploaded` : `${resp.response[0].title} has been uploaded`);
        this.onUpload.emit(resp.response);
      })
      .catch((err: any) => {
        this.uploading = false;
        console.log(err)
      });
    
  }
  
}
