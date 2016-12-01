import {Component, OnInit, Input} from "@angular/core";

import { AmpedFormatPipe } from './pipes/amped.common.format';


class TableCell{
  @Input() header : string;
  @Input() row : any;
}

@Component({
  moduleId: module.id,
  selector: 'table-cell-json',
  template: `
      {{label}}
      <button md-icon-button [md-menu-trigger-for]="menu">
         <md-icon>more_vert</md-icon>
      </button>

<md-menu #menu="mdMenu">
  <span md-menu-item *ngFor="let key of keys"> {{key | format : 'slugtotitle'}} - {{row[header][key] || 'N/A'}} </span>
</md-menu>`
})
export class JSONCell extends TableCell implements OnInit {
  
  private keys : Array<string>;
  private label : string;
  
  ngOnInit() {
    this.keys = Object.keys(this.row[this.header]);
    this.label = this.row[this.header][this.keys.shift()];
  }
  
}


@Component({
    moduleId: module.id,
    selector: 'table-cell-text',
    template : `{{row[header]}}`
})
export class TextCell extends TableCell implements OnInit {

    ngOnInit() { }
    
}


@Component({
  moduleId: module.id,
  selector: 'table-cell-image',
  template : `<img md-card-avatar src="{{row[header]}}" title="{{header}}" />`
})
export class ImageCell extends TableCell implements OnInit {
  
  ngOnInit() { console.log(this.row[this.header]);}
  
}
