import {Component, OnInit, OnDestroy, Input, OnChanges} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'amped-table',
  template: `
    <table class="table">
      <thead>
      <tr>
        <th *ngFor="let header of headers">{{header | format : 'slugtotitle'}}</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let row of rows | ampedfilter : headers : filter">
        <td *ngFor="let header of headers">
          <span *ngIf="header !== 'photo' && header !== 'image'" title="{{row[header]}}">{{row[header] | truncate}}</span>
          
          <img md-card-avatar *ngIf="header == 'photo' || header == 'image'" src="{{row[header]}}" title="{{header}}" />
        </td>
        <td class="action-cell">
        <button md-icon-button (click)="onEditClick(row.id)">
          <md-icon >edit</md-icon>
        </button>
        <button md-icon-button (click)="onDeleteClick(row.id)">
          <md-icon >delete</md-icon>
        </button>
          
          
          <!--<i *ngIf="enableCrud" class="fa fa-pencil pointer" aria-hidden="true" ></i>-->
          <!--<i *ngIf="enableCrud" class="fa fa-trash pointer" aria-hidden="true" (click)="onDeleteClick(row.id)"></i>-->
        </td>
      </tr>
      </tbody>
    </table>
  `
})
export class AmpedTableComponent implements OnInit, OnChanges {
  
  @Input() data       : Array<any>;
  @Input() title      : string;
  @Input() enableCrud : boolean = true;
  
  @Input() filter     : string;
  
  private headers     : Array<string> = [];
  private rows        : Array<Object> = [];
  private sub         : any;
  private model       : string;
  
  constructor(private router : Router, private route: ActivatedRoute) {
  }
  
  ngOnInit() {
    console.log('TABLE INIT', this.data);
    this.sub = this.route.params.subscribe( (params : any) => this.model = params.model);
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  
  onEditClick(id : string){
    this.router.navigate(['/edit', this.model, id]);
  }
  
  onDeleteClick(id : string){
    // this.router.navigate(['/edit', this.model, id]);
    console.log('@TODO need to build a confirm alert to ask if the user wants to delete');
  }
  
  ngOnChanges(changes :any){
    if( typeof this.data !== 'undefined' && this.data.length > 0 ) {
      this.filterFields();
      this.setHeaders();
    }
    // @TODO use an Observable
    
  }
  
  filterFields(){
    this.rows = this.data.slice(0).map(row =>{
      delete row.created_at; delete row.updated_at; delete row.deleted_at; delete row.deleted_by;
      delete row.token;
      return row;
    });
  }
  setHeaders(){
    this.headers = Object.keys(this.data[0]);
  }
  
}
