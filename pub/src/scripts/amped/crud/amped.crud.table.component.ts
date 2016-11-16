import {Component, OnInit}    from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
import { AmpedFormsService }  from './amped.crud.service';

@Component({
  moduleId: module.id,
  selector: 'amped-crud-table',
  template: `
  <div class="row">
    <div class="col-sm-10">
      <h1 class="pull-left">Edit {{model | format : 'capitalize' : 'another one'}}</h1>
      <input type="text" [(ngModel)]="filter" placeholder="Filter data" class="pull-left form-control" style="width:300px; margin-top:6px; margin-left:25px;" />
    </div>
    <amped-add-new></amped-add-new>
  </div>
    <amped-table [data]="tableData" enableCrud="false"></amped-table>
`
})
export class AmpedCrudTableComponent implements OnInit {
  
  public tableData : Array<any> = [];
  
  private model : string = '';
  
  private sub : any;
  
  
  constructor(private FormService: AmpedFormsService, private route: ActivatedRoute) {
  }
  
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const {model, id} = params;
      this.model = model;
      // Retrieve Pet with Id route param
      this.FormService.getCrudData(model).then(data => {
        console.log(data);
        this.tableData = data;
      });
    });
  }
  
}
