import {Component, OnInit}    from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
import { AmpedFormsService }  from './amped.forms.service';

@Component({
  moduleId: module.id,
  selector: 'amped-crud-table',
  template: `<amped-table [data]="tableData"></amped-table>`
})
export class AmpedCrudTableComponent implements OnInit {
  
  public tableData : Array<any> = [];
  
  private sub : any;
  
  
  constructor(private FormService: AmpedFormsService, private route: ActivatedRoute) {
  }
  
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const {model, id} = params;
      // let id = params['id'];
      // Retrieve Pet with Id route param
      this.FormService.getCrudData(model).then(data => {
        console.log(data);
        this.tableData = data;
      });
    });
  }
  
}
