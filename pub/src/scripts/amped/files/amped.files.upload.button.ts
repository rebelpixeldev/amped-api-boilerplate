import {Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { AmpedFilesService } from './amped.files.service';

@Component({
  moduleId: module.id,
  selector: 'amp-upload-btn',
  template: `
      <label>
        <button md-raised-button color="primary" (change)="uploadFile($event)">
          <input [(ngModel)]="files" type="file" required multiple />
          Upload
          </button>
      </label>
    `
})
export class UploadBtnComponent implements OnInit {

  @ViewChild('uploadInput') input : HTMLElement;

  @Output() onUpload : EventEmitter<any> = new EventEmitter();

  public files : any = null;

  constructor(private filesService : AmpedFilesService) {
  }

  ngOnInit() {
  }

  uploadFile(evt : any) {

    var files = evt.srcElement.files;
    console.log(files);
    console.log('UPLOADING FIE');
    const body = new FormData();

    for (let i = 0, len = files.length; i < len; i++) {
      body.append('files[]', files[i]);
    }

    // body.append('files', files);
      evt.srcElement.value = '';
    this.filesService.uploadFile(body)
      .then((resp) => {
          console.log('FILE UPLOAD RESPONSE', resp);
        this.onUpload.emit(resp);
      })
      .catch(( err:any ) => console.log(err));

  }

}
