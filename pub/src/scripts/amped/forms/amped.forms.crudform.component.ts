import {Component, OnInit} from '@angular/core';
import { AmpedFormsService } from './amped.forms.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'amped-crud-form',
  template: `<amped-form [data]="formData"></amped-form>`
})
export class AmpedCrudFormComponent implements OnInit {
  
  public formData : Object = {};
  
  private sub : any;
  
  constructor(private FormService : AmpedFormsService, private route: ActivatedRoute) {
  }
  
  ngOnInit() {
    
    this.sub = this.route.params.subscribe(params => {
      const {model, id} = params;
      // let id = params['id'];
      // Retrieve Pet with Id route param
      this.FormService.getCrudData(model, id).then(data => {
        this.formData = {
          action : `/api/${model}/${id}`,
          fields : data
        };
      });
    });
    
    //
    
  }
  
  // ngOnDestroy() {
  //   // Clean sub to avoid memory leak
  //   this.sub.unsubscribe();
  // }
  
}
