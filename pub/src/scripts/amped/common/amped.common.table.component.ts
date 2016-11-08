import {Component, OnInit, OnDestroy, Input, OnChanges} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'amped-table',
  templateUrl: 'templates/amped.common.table.component.html'
})
export class AmpedTableComponent implements OnInit, OnChanges {
  
  @Input() data: Array<any>;
  
  private headers : Array<string> = [];
  private rows : Array<Object> = [];
  private sub : any;
  private model : string;
  
  constructor(private router : Router, private route: ActivatedRoute) {
  }
  
  ngOnInit() {
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
