import {Component, OnInit, Input} from '@angular/core';
import { AmpedFormsService } from './amped.crud.service';
import { ActivatedRoute } from '@angular/router';
import {AmpedAlertService} from "../alerts/amped.alert.service";

@Component({
  moduleId: module.id,
  selector: 'amped-crud-form',
  template: `

    <md-card>
      <amped-form *ngIf="formData" [data]="formData" [model]="model" (onSubmit)="onFormSubmit($event)" [hideTitle]="hideTitle" [title]="title"></amped-form>
    </md-card>
    
    <!--<amp-media-library (onFileSelect)="handleFileSelect($event)"></amp-media-library>-->
`
})
export class AmpedCrudFormComponent implements OnInit {

  @Input() params : any;
  @Input() setFromUrl : string = 'true';
  @Input() hideTitle : string = 'false';
  
  @Input() model : string;
  @Input() id : string;
  @Input() title : string;

  public formData : Object = {};

  private sub : any;

  constructor(private FormService : AmpedFormsService, private route: ActivatedRoute, private ampAlert : AmpedAlertService ) {
  }

  ngOnInit() {
    
    if ( this.setFromUrl === 'true' ) {
      this.sub = this.route.params.subscribe(routeParams => {
        const {model, id} = this.params || routeParams;
        this.model = model;
        this.id = id;
        // let id = params['id'];
        // Retrieve Pet with Id route param
        this.getFormData();
      });
    } else
      this.getFormData();
  }
  
  getFormData(){
    this.FormService.getCrudData(this.model, this.id).then(data => {
      this.formData = {
        action: `/api/${this.model}/${this.id || ''}`,
        method: 'POST',
        fields: data.response
      };
    }).catch((err) => {
      console.log('ERROR', err);
    });
  }

  handleFileSelect(data :any){
    console.log(data);
  }
  
  
  //@TODO needs response type
  onFormSubmit(resp : any){
    if ( resp.success )
      this.ampAlert.snackSuccess('', `Update Successful`);
  }

  // ngOnDestroy() {
  //   // Clean sub to avoid memory leak
  //   this.sub.unsubscribe();
  // }

}
