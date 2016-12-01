import {Component, OnInit, Input, Output, OnChanges} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';

interface FieldInterface{
  label     : String;
  name      : String;
  value     : any;
  type      : String;
  required  : Boolean;
  options   : Array<any>;
}

interface FormDataInterface{
  action : string;
  fields : Array<Object>;
}

@Component({
  moduleId: module.id,
  selector: 'amped-form',
  template: `

    <md-card>
       <md-card-title>Editing {{model}}</md-card-title>   
       <md-card-content>
            <form *ngIf="form" (ngSubmit)="onSubmit()" [formGroup]="form">
      
              <div *ngFor="let field of fields">
                
                <div [ngSwitch]="field.type">
                    <!-- Hidden input -->
                    <div *ngSwitchCase="'hidden'" class="col-xs-12 amp-form-element">
                         <input type="hidden" [formControlName]="field.name" />
                    </div>
                    
                    <!-- Text input -->
                    <div *ngSwitchCase="'text'" class="col-xs-12 amp-form-element">
                        <md-input placeholder="{{field.label}}" [formControlName]="field.name"></md-input>
                    </div>
                    <!-- Number input -->
                    <div *ngSwitchCase="'number'" class="col-xs-12 amp-form-element">
                      <label for="">{{field.label}}</label>
                         <input type="number" class="form-control" [formControlName]="field.name" />
                    </div>
                    <!-- Email input -->
                    <div *ngSwitchCase="'email'" class="col-xs-12 amp-form-element">
                      <label for="">{{field.label}}</label>
                         <input type="email" class="form-control" [formControlName]="field.name" />
                    </div>
                    <!-- Email input -->
                    <div *ngSwitchCase="'image'" class="col-xs-12 amp-form-element">
                      <amp-file-upload-display [data]="field.value"></amp-file-upload-display>
                      <!--<img [src]="field.value" alt="">-->
                    </div>
                    
                    
                    <div *ngSwitchCase="'select'" class="col-xs-12">
                        <label for="">{{field.label}}</label>
                        <select class="form-control" [formControlName]="field.name">
                            <option *ngFor="let option of field.options" [value]="option.value">{{option.label}}</option>
                        </select>
                    </div>
                    
                </div>
              </div>
              
              <button md-raised-button color="primary"  type="submit" [disabled]="!form.valid">Save</button>
          
            </form>
       </md-card-content>
       <!--<md-card-actions>-->
            <!--<button md-button>LIKE</button>-->
            <!--<button md-button>SHARE</button>-->
       <!--</md-card-actions>-->
    </md-card>

  `
})
export class AmpedFormComponent implements OnInit, OnChanges {
  
  @Input() data: FormDataInterface = {action:'', fields:[]};
  
  public formControls     : any = {};
  public fields           : Array<FieldInterface> = [];
  public form             : FormGroup;
  
  private _fieldDefaults  : Object = { label : 'My Field', name : 'my_field', value : '', type : 'text', required:false, options : [] };
  
  constructor(private _fb: FormBuilder) {}
  
  ngOnInit() {
    
      this.buildForm();
    
  }
  
  ngOnChanges(changes :any){
      this.buildForm();
    // @TODO use an Observable
    
  }
  
  mapDataDefaults(){
    this.fields = this.data.fields.map( (field : FieldInterface) => Object.assign({}, this._fieldDefaults, field) );
  }
  
  buildForm(){
    console.log('BUILDING FORM', this.data);
    if( typeof this.data.fields !== 'undefined' ) {
      this.mapDataDefaults();
      this.formControls = this.fields.reduce((ret: any, field: FieldInterface, i: Number) => {
        ret[field.name.toString()] = field.required ?
          new FormControl(field.value, Validators.required) :
          new FormControl(field.value);
        return ret;
      }, {});
      this.form = new FormGroup(this.formControls);
    }
  }
  
  onSubmit() {
    console.log('Submit');
    console.log(this.form.value);
  
    // this.formService.submitForm(this.data.action, this.form.value);
    
    
  }
}
