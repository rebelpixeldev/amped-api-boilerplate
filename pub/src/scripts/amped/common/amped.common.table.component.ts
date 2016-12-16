import {
  Component, OnInit, OnDestroy, Input, OnChanges, ViewChild, ElementRef,
  ComponentFactoryResolver, ViewContainerRef, ComponentRef, Pipe, Injectable, PipeTransform
} from '@angular/core';

import {Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
import {MdMenu, MdMenuTrigger} from "@angular/material";
import {JSONCell, ImageCell, TextCell, DateCell} from "./amped.common.table.cells";

@Component({
  selector: 'amped-table',
  template: `
    <div class="flex-space-between">
        <span class="@TODO pagination"></span>
        <md-input placeholder="Filter table" [(ngModel)]="filterValue">
          <span md-suffix><md-icon>search</md-icon></span>
        </md-input>
    </div>
    
    <table class="table">
      <thead>
      <tr>
        <th *ngFor="let header of headers">{{header | format : 'slugtotitle'}}</th>
        <th *ngIf="actionsEnabled !== 'false'"></th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let row of rows | tableFilter : filterValue">
        <td *ngFor="let header of headers">
          <amped-table-cell [header]="header" [row]="row"></amped-table-cell>
        </td>
        <td *ngIf="actionsEnabled !== 'false'" class="action-cell">
          <button md-icon-button (click)="onEditClick(row.id)">
            <md-icon >edit</md-icon>
          </button>
          <button md-icon-button (click)="onDeleteClick(row.id)">
            <md-icon >delete</md-icon>
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  `
})
export class AmpedTable implements OnInit, OnChanges {
  
  @Input() data: Array<any>;
  @Input() title: string;
  @Input() actionsEnabled: boolean = true;
  
  @Input() filter: string;
  
  private headers: Array<string> = [];
  private rows: Array<Object> = [];
  private sub: any;
  private model: string;
  private filterValue : string = ''
  
  constructor(private router: Router, private route: ActivatedRoute) {
  }
  
  ngOnInit() {
    this.sub = this.route.params.subscribe((params: any) => this.model = params.model);
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  
  onEditClick(id: string) {
    this.router.navigate(['/edit', this.model, id]);
  }
  
  onDeleteClick(id: string) {
    // this.router.navigate(['/edit', this.model, id]);
    console.log('@TODO need to build a confirm alert to ask if the user wants to delete');
  }
  
  ngOnChanges(changes: any) {
    if (typeof this.data !== 'undefined' && this.data.length > 0) {
      this.filterFields();
      this.setHeaders();
    }
    // @TODO use an Observable
  }
  
  filterFields() {
    this.rows = this.data.slice(0).map(row => {
      const created = row.created_at;
      const updated = row.updated_at;
      delete row.created_at;
      delete row.updated_at;
      delete row.deleted_at;
      delete row.deleted_by;
      delete row.token;
      
      row.created_at = created;
      row.updated_at = created;
      
      return row;
    });
  }
  
  setHeaders() {
    let headers = Object.keys(this.data[0]);
    const
      createdIndex : number = headers.indexOf('created_at'),
      updatedIndex : number = headers.indexOf('updated_at');
  
    if (updatedIndex !== -1)
      headers = [...headers.slice(0, updatedIndex), ...headers.slice(updatedIndex + 1), 'updated_at'];
    if ( createdIndex !== -1) {
      headers = [...headers.slice(0, createdIndex), ...headers.slice(createdIndex + 1), 'created_at'];
    }
  
    this.headers = headers;
  }
}


@Pipe({
  name: 'tableFilter'
})
@Injectable()
export class tableFilter implements PipeTransform {
  transform(items: any[], args: any[]): any {
    const term = args.toString().toLowerCase();
    return items.filter(item => {
      return Object.keys(item).filter((key) => {
          return item[key] !== null && typeof item[key] === 'object' ?
              Object.keys(item[key]).filter(( ik ) => item[key][ik] !== null && item[key][ik].toString().toLowerCase().indexOf(term) !== -1).length > 0 :
              item[key] !== null && item[key].toString().toLowerCase().indexOf(term) !== -1;
      }).length > 1;
    });
  }
}

@Component({
  moduleId: module.id,
  selector: 'amped-table-cell',
  template: `<div #elemContainer></div>`
})
export class AmpedTableCell {
  
  @Input() header: any;
  @Input() row: any;
  
  private cellInstance : any;
  
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  
  @ViewChild('elemContainer', {read: ViewContainerRef})
  private elemContainer: any;
  private componentReference : ComponentRef<any>;
  private isViewInitialized: boolean = false;
  
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private _sanitizer: DomSanitizer, protected resolver: ComponentFactoryResolver, elementRef: ElementRef) {
  }
  
  ngOnInit() {
    this.isViewInitialized = true;
    let component : any = null;
    
    if ( this.header.indexOf('photo') > -1 || this.header.indexOf('image') > -1 )
      // this.content = '<img md-card-avatar src="{{row[header]}}" title="{{header}}" />';
      component = ImageCell;
    else if ( this.header === 'created_at' || this.header === 'updated_at' )
      component = DateCell;
    else if (typeof this.row[this.header] === 'object') {
      component = JSONCell;
    } else {
      component = TextCell;
    }
  
    this.cellInstance = this.elemContainer.createComponent(this.componentFactoryResolver.resolveComponentFactory(component)).instance;
    this.cellInstance.header = this.header;
    this.cellInstance.row = this.row;
    
  }
}

