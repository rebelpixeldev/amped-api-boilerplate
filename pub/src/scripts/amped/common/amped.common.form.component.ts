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
              
              <md-grid-list *ngFor="let row of fields" cols="{{row.length}}" rowHeight="60px" gutterSize="10">
                <md-grid-tile *ngFor="let field of row" >
                  <div [ngSwitch]="field.type" class="amped-form-element">
                    <!-- Hidden input -->
                         <input *ngSwitchCase="'hidden'" type="hidden" [formControlName]="field.name" />
                    <!-- Text input -->
                        <md-input *ngSwitchCase="'text'" placeholder="{{field.label}}" [formControlName]="field.name"></md-input>
                        
                        <!--<md-input *ngSwitchCase="'json_text'" placeholder="{{field.label}}" [formControlName]="field.name"></md-input>-->
                   
                    <!-- Number input -->
                      <div *ngSwitchCase="'json_text'">
                          <md-grid-list cols="{{getJsonFieldKeys(field.value).length}}" rowHeight="60px" gutterSize="10">
                            <md-grid-tile *ngFor="let key of getJsonFieldKeys(field.value)">
                              <md-input placeholder="{{field.value[key]}}"></md-input>
                            </md-grid-tile>
                          </md-grid-list>
                      </div>
                         <input *ngSwitchCase="'number'" type="number" class="form-control" [formControlName]="field.name" />
                    
                    <!-- Email input -->
                         <input *ngSwitchCase="'email'" type="email" class="form-control" [formControlName]="field.name" />
                    
                    <!-- Email input -->
                      <amp-file-upload-display *ngSwitchCase="'image'" [data]="field.value"></amp-file-upload-display>
                      <!--<img [src]="field.value" alt="">-->
                      <div *ngSwitchCase="'select'" class="col-xs-12">
                          <label for="">{{field.label}}</label>
                          <select class="form-control" [formControlName]="field.name">
                              <option *ngFor="let option of field.options" [value]="option.value">{{option.label}}</option>
                          </select>
                      </div>
                    </div>
                  </md-grid-tile>  
                </md-grid-list >
              
              
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
    this.fields = this.data.fields.map( ( rows : any ) => {
      return rows.map( ( field : FieldInterface ) => Object.assign({}, this._fieldDefaults, field) );//Object.assign({}, this._fieldDefaults, field) )
    } );
  }
  
  buildForm(){
    if( typeof this.data.fields !== 'undefined' ) {
      this.mapDataDefaults();
      console.log(this.fields);
      
      
      this.formControls = this.fields.reduce((ret : any, row : any) => {
        // return [...rowsRet, rows.reduce((ret: any, field: FieldInterface, i: Number) => {
        //   console.log(field);
        //     ret[field.name.toString()] = field.required ?
        //     new FormControl(field.value, Validators.required) :
        //     new FormControl(field.value);
        //   return ret;
        // }, {})];
        
        row.forEach((field : any) => {
          ret[field.name.toString()] = field.required ?
              new FormControl(field.value, Validators.required) :
              new FormControl(field.value);
        })
        
        return ret;
        
      }, {});
      
      console.log(this.formControls);
      
      this.form = new FormGroup(this.formControls);
    }
  }
  
  getColumnWidth(cols){
    return Math.ceil(cols/12);
  }
  
  getJsonFieldKeys(json){
    return Object.keys(json);
  }
  
  onSubmit() {
    console.log('Submit');
    console.log(this.form.value);
  
    // this.formService.submitForm(this.data.action, this.form.value);
  }
}
