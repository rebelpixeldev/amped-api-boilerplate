import {
  Component, OnInit, OnDestroy, Input, OnChanges, ViewChild, ElementRef,
  ComponentFactoryResolver, ViewContainerRef, ComponentRef, Pipe, Injectable, PipeTransform, Output, EventEmitter
} from '@angular/core';

import {Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
import {MdMenu, MdMenuTrigger} from "@angular/material";
import {JSONCell, ImageCell, TextCell, DateCell} from "./amped.common.table.cells";
import {AmpedService} from "./amped.common.service";

@Component({
  selector: 'amped-table',
  template: `
    <div class="flex-space-between flex-middle">
        <span *ngIf="showPagination !== 'false'">
        <pagination-controls (pageChange)="page = $event" #controls></pagination-controls>
        </span>
        <div>
          <md-input *ngIf="showFilter !== 'false'" placeholder="Filter table" [(ngModel)]="filterValue">
            <span md-suffix><md-icon>search</md-icon></span>
          </md-input>
        </div>
    </div>
    
    <table class="table">
      <thead>
      <tr>
        <th *ngFor="let header of keys(headers)">{{header | format : 'slugtotitle'}}</th>
        <th *ngIf="actionsEnabled !== 'false'"></th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let row of rows | tableFilter : filterValue | paginate: { itemsPerPage: perpage,
                                                                  currentPage: page}">
        <td *ngFor="let header of keys(headers)">
          <amped-table-cell [header]="headers[header]" [row]="row"></amped-table-cell>
        </td>
        <td *ngIf="actionsEnabled !== 'false'" class="action-cell">
           <!--<button md-icon-button md-menu-trigger-for="mdMenu">-->
               <!--<md-icon>more_vert</md-icon>-->
            <!--</button>-->
            
            <button md-icon-button [md-menu-trigger-for]="menu" >
               <md-icon>more_vert</md-icon>
            </button>
            
            <md-menu #menu="mdMenu">
                <button md-menu-item (click)="onEditClick(row.id)"> 
                  <md-icon >edit</md-icon> Edit 
                 </button>
                <button md-menu-item amp-alerts-confirm-trigger
                        color="warn"
                        title="Remove Item" 
                        [onYes]="handleDelete.bind(this, row)"
                        description="Once deleted you will not be able to get it back.">
                  <md-icon >delete</md-icon>Delete 
                </button>
            </md-menu>
          
          <!--<md-menu #menu="mdMenu">-->
            <!--<md-nav-list>-->
              <!--<md-list-item>-->
                 <!--<a md-line href="...">{{ link }}</a>-->
                 <!--<button md-icon-button (click)="onEditClick(row.id)">-->
                    <!--<md-icon >edit</md-icon>-->
                  <!--</button>-->
              <!--</md-list-item>-->
              <!--<md-list-item>-->
                 <!--<a md-line href="...">{{ link }}</a>-->
                 <!--<button md-icon-button (click)="onDeleteClick(row.id)">-->
                    <!--<md-icon >delete</md-icon>-->
                  <!--</button>-->
              <!--</md-list-item>-->
            <!--</md-nav-list>-->
          <!--</md-menu>-->
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
  @Input() headers: {} = null;
  @Input() model : string;
  
  @Input() showFilter : boolean = true;
  @Input() showPagination : boolean = true;
  
  @Input() perpage : number = 10;
  @Input() page : number = 1;
  
  @Output() onDelete : EventEmitter<any> = new EventEmitter();
  
  private rows: Array<Object> = [];
  private sub: any;
  
  private filterValue : string = '';
  
  constructor(private router: Router, private route: ActivatedRoute, private ampedService : AmpedService) {
  }
  
  ngOnInit() {
    this.sub = this.route.params.subscribe((params: any) => {
      if ( typeof params.model !== 'undefined' ) {
        this.model = params.model;
        this.setHeaders();
      }
        
    });
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  
  onEditClick(id: string) {
    this.router.navigate(['/edit', this.model, id]);
  }
  
  ngOnChanges(changes: any) {
    if (typeof this.data !== 'undefined' && this.data.length > 0) {
      this.filterFields();
      // this.setHeaders();
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
      row.updated_at = updated;
      
      return row;
    });
  }
  
  setHeaders() {
    
    this.ampedService.get(`/api/${this.model}/tableHeaders`)
      .then(( resp : any ) => this.headers = resp.response );
    
    // if ( this.headers === null ) {
    //   let headers = Object.keys(this.data[0]);
    //   const
    //     createdIndex: number = headers.indexOf('created_at'),
    //     updatedIndex: number = headers.indexOf('updated_at');
    //
    //   if (updatedIndex !== -1)
    //     headers = [...headers.slice(0, updatedIndex), ...headers.slice(updatedIndex + 1), 'updated_at'];
    //   if (createdIndex !== -1) {
    //     headers = [...headers.slice(0, createdIndex), ...headers.slice(createdIndex + 1), 'created_at'];
    //   }
    //   this.headers = headers.reduce(( ret, header ) => {
    //     ret[header] = header;
    //     return ret;
    //   }, {});
    // }
  }
  
  keys(obj : any){
    if ( obj === null )
      return [];
    return Object.keys(obj);
  }
  
  handleDelete(row : any){
    this.onDelete.emit({entry : row});
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
    
    console.log(this.header, typeof this.row[this.header]);
    
    if ( this.header.indexOf('photo') > -1 || this.header.indexOf('image') > -1 || this.header === 'upload' )
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

