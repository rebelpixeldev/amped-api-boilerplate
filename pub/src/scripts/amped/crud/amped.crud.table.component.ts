import {Component, OnInit}    from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
import { AmpedFormsService }  from './amped.crud.service';

@Component({
  moduleId: module.id,
  selector: 'amped-crud-table',
  template: `
    <md-card>
       <md-card-header>
          <md-card-title><h1>Edit {{model | format : 'capitalize'}}</h1></md-card-title>
          <span class="fill-remaining-space"></span>
          
          <md-input placeholder="Filter data" [(ngModel)]="filter">
            <span md-suffix>
              <md-icon>search</md-icon>
            </span>
          </md-input>
          <amped-add-new></amped-add-new>
       </md-card-header>
       <md-card-content>
          <amped-table [data]="tableData" enableCrud="true"></amped-table>
       </md-card-content>
    </md-card>
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
        this.tableData = data;
      });
    });
  }

}
