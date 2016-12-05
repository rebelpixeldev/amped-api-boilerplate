import {Component, OnInit, Input} from '@angular/core';
import { AmpedFormsService } from './amped.crud.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'amped-crud-form',
  template: `

    <md-card>
      <amped-form *ngIf="formData" [data]="formData" [model]="model"></amped-form>
    </md-card>
    
    <!--<amp-media-library (onFileSelect)="handleFileSelect($event)"></amp-media-library>-->
`
})
export class AmpedCrudFormComponent implements OnInit {

  @Input() params : any;

  public formData : Object = {};

  private sub : any;
  private model : string;

  constructor(private FormService : AmpedFormsService, private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(routeParams => {
      const {model, id} = this.params || routeParams;
      this.model = model;
      // let id = params['id'];
      // Retrieve Pet with Id route param
      this.FormService.getCrudData(model, id).then(data => {
        this.formData = {
          action : `/api/${model}/${id || ''}`,
          fields : data
        };
      });
    });
  }

  handleFileSelect(data :any){
    console.log(data);
  }

  // ngOnDestroy() {
  //   // Clean sub to avoid memory leak
  //   this.sub.unsubscribe();
  // }

}
