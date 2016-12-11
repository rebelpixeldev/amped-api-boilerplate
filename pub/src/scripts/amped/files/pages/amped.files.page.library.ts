import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'amp-files-library-page',
    template: `
      <md-card>
        <md-card-title>Media Library</md-card-title>
        <amp-media-library></amp-media-library>
      </md-card>
    `
})
export class FilesLibraryPage {
    constructor() { }
}
