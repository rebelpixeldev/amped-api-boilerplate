import {Component, OnInit, Input, OnChanges} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'amp-file-upload-display',
  template: `
  <md-card>
    <md-card-title-group>
        <img md-card-sm-image *ngIf="data" [src]="data.source_url" />
        <md-card-title>{{data.title}}</md-card-title>
        <md-card-subtitle>
          <button md-raised-button amp-files-dialog color="primary" (click)="changeUpload()">
            Change
          </button>
        </md-card-subtitle>
        
     </md-card-title-group>
  </md-card>
  `
})
export class AmpedFileUploadDisplay implements OnInit, OnChanges {
  
  @Input() data : any; // @TODO add file interface
  
  constructor() {
  }
  
  ngOnInit() {
    console.log(this.data);
  }
  
  ngOnChanges(changes :any){
    console.log('YAYAY');
    if( typeof this.data !== 'undefined' ) {
      console.log(changes);
      console.log(this.data);
    }
    // @TODO use an Observable
    
  }
  
  changeUpload(){
    
  }
  
}
