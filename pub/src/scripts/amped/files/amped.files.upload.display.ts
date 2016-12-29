import {Component, OnInit, Input, OnChanges, EventEmitter, Output} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'amp-file-upload-display',
  template: `
  <!--<md-card>-->
  <label class="md-input-placeholder md-float">{{this.label}}</label>
  <div class="amp-upload-display-container">
    <md-card-title-group>
        <img md-card-sm-image *ngIf="data" [src]="data.thumb_url" />
        <md-card-title>{{data.title}}</md-card-title>
        <md-card-subtitle>
          <button md-raised-button amp-files-dialog (onFileSelect)="handleFileSelect($event)" color="primary" (click)="changeUpload()">
            Change
          </button>
        </md-card-subtitle>
     </md-card-title-group>
   </div>
  <!--</md-card>-->
  `
})
export class AmpedFileUploadDisplay implements OnInit, OnChanges {

  @Input() data : any; // @TODO add file interface
  @Input() label : string;
  @Output() onFileSelect : EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    console.log(this.data);
  }

  ngOnChanges(changes :any){
    if( typeof this.data !== 'undefined' ) {

    }
    // @TODO use an Observable

  }

  changeUpload(){
    return false;
  }

  handleFileSelect(file : any){
    this.data = file;
    this.onFileSelect.emit(file);
  }

}
