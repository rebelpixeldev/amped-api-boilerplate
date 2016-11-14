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
    <form *ngIf="form" (ngSubmit)="onSubmit()" [formGroup]="form">
      
      <div *ngFor="let field of fields">
        
        <div [ngSwitch]="field.type">
        
            <div *ngSwitchCase="'hidden'" class="col-xs-12">
                 <input type="hidden" [formControlName]="field.name" />
            </div>
            
            <div *ngSwitchCase="'text'" class="col-xs-12">
              <label for="">{{field.label}}</label>
                 <input type="text" class="form-control" [formControlName]="field.name" />
            </div>
            
            <div *ngSwitchCase="'number'" class="col-xs-12">
              <label for="">{{field.label}}</label>
                 <input type="number" class="form-control" [formControlName]="field.name" />
            </div>
            
            <div *ngSwitchCase="'email'" class="col-xs-12">
              <label for="">{{field.label}}</label>
                 <input type="email" class="form-control" [formControlName]="field.name" />
            </div>
            
            <div *ngSwitchCase="'select'" class="col-xs-12">
                <label for="">{{field.label}}</label>
                <select class="form-control" [formControlName]="field.name">
                    <option *ngFor="let option of field.options" [value]="option.value">{{option.label}}</option>
                </select>
            </div>
            
        </div>
      </div>
      
      <button type="submit" class="btn btn-primary" [disabled]="!form.valid">Save</button>
  
    </form>

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
    
    console.log('FIELDS', this.fields);
  
    
  }
  
  onSubmit() {
    console.log('Submit');
    console.log(this.form.value);
  
    // this.formService.submitForm(this.data.action, this.form.value);
    
    
  }
}
