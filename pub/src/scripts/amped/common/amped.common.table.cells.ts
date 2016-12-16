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
    if ( typeof this.row[this.header] !== 'undefined' && this.row[this.header] !== null ) {
      this.keys = Object.keys(this.row[this.header]);
      this.label = this.row[this.header][this.keys.shift()];
    }
  }

}


@Component({
    moduleId: module.id,
    selector: 'table-cell-text',
    template : `{{row[header]}}`
})
export class TextCell extends TableCell{}


@Component({
  moduleId: module.id,
  selector: 'table-cell-image',
  template : `<img md-card-avatar src="{{row[header]}}" title="{{header}}" />`
})
export class ImageCell extends TableCell{}


@Component({
  moduleId: module.id,
  selector: 'table-cell-date',
  template : `{{row[header] | amTimeAgo}}`
})
export class DateCell extends TableCell{}

