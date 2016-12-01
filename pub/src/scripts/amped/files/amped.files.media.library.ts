import { Component, OnInit } from '@angular/core';

import { AmpedFilesService } from './amped.files.service';

@Component({
    moduleId: module.id,
    selector: 'amp-media-library',
    templateUrl: 'templates/media-library.component.html'
})
export class MediaLibraryComponent implements OnInit {
  
  private files : Array<any> = []; // @TODO need to type to a files interface
  
    constructor(private filesService : AmpedFilesService) { }

    ngOnInit() {
      this.filesService.getFiles()
        .then((resp) => this.files = resp);
    }
    
    uploadFile(){
      
    }
    
}
