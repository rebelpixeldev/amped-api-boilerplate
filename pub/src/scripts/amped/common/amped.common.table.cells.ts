import {Component, OnInit, Input} from "@angular/core";

export class TableCell{
  @Input() header : string;
  @Input() row : any;
}

@Component({
  moduleId: module.id,
  selector: 'table-cell-json',
  template: `
      {{label}}
      <button md-icon-button [md-menu-trigger-for]="menu">
         <md-icon>remove_red_eye</md-icon>
      </button>

      <md-menu #menu="mdMenu">
        <span md-menu-item *ngFor="let key of keys"> {{key | format : 'slugtotitle'}} - {{ refObject[key] || 'N/A'}} </span>
      </md-menu>`
})
export class JSONCell extends TableCell implements OnInit {

  private keys : Array<string>;
  private label : string = '';
  private refObject : any;

  ngOnInit() {
    if ( typeof this.row[this.header] !== 'undefined' && this.row[this.header] !== null ) {
      
      this.refObject = this.row[this.header].constructor === Array ? this.row[this.header][0] : this.row[this.header];
      
      this.keys = Object.keys(this.refObject);
      // this.label = this.refObject.name || this.refObject.title || this.refObject[this.keys.shift()];
    }
  }

}


@Component({
    moduleId: module.id,
    selector: 'table-cell-text',
    template : `{{label}}`
})
export class TextCell extends TableCell implements OnInit{
  
  private label : string = '';
  
  ngOnInit(){
    const parts = this.header.split('.');
    this.label = parts.length === 1 ?
          this.row[this.header] : this.row[parts[0]][parts[1]];
  }
  
}


@Component({
  moduleId: module.id,
  selector: 'table-cell-image',
  template : `<img md-card-avatar src="{{row[header] ? row[header].source_url : ''}}" title="{{header}}" />`
})
export class ImageCell extends TableCell{}


@Component({
  moduleId: module.id,
  selector: 'table-cell-date',
  template : `{{row[header] | amTimeAgo}}`
})
export class DateCell extends TableCell{}

