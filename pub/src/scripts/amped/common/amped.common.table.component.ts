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
  
  onChange(evt : any, id : string){
  
    console.log();
    if ( evt.target.value === 'edit' )
      this.router.navigate(['/edit', this.model, id]);
    
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
