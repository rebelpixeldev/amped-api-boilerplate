import {Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {AmpedService} from "../common/amped.common.service";

interface FieldInterface {
  label: String;
  name: String;
  value: any;
  type: String;
  required: Boolean;
  options: Array<any>;
}

interface FormDataInterface {
  action: string;
  method: string;
  fields: Array<Object>;
}

@Component({
  moduleId: module.id,
  selector: 'amped-form',
  template: `
       <md-card-title *ngIf="getFormTitle() && hideTitle === 'false'">{{getFormTitle()}}</md-card-title>
       <md-card-content>
            <form *ngIf="form" (ngSubmit)="onFormSubmit()" [formGroup]="form">
            
            <input type="hidden" name="{{field.name}}" value="{{field.value}}" *ngFor="let field of hiddenFields">
            
              <md-grid-list *ngFor="let row of fields" cols="{{row.length}}" rowHeight="{{getRowHeight(row)}}" gutterSize="{{gutterSize}}">
                <md-grid-tile *ngFor="let field of row" >
                  <div [ngSwitch]="field.type" class="amped-form-element">
                    
                    <!-- Text input -->
                    <md-input *ngSwitchCase="'text'" placeholder="{{field.label}}" [formControlName]="field.name"></md-input>
                    
                    <!-- Password input -->
                    <md-input *ngSwitchCase="'password'" type="password" placeholder="{{field.label}}" [formControlName]="field.name"></md-input>
                    
                    <!-- Number Fields -->
                    <md-input *ngSwitchCase="'number'" type="number" class="form-control" [formControlName]="field.name"></md-input>
                    
                    <!-- Email input -->
                    <md-input *ngSwitchCase="'email'" type="email" class="form-control" [formControlName]="field.name"></md-input>
                   
                    <!-- JSON Field -->
                    <div *ngSwitchCase="'json_text'">
                        <md-grid-list cols="{{getJsonFieldKeys(field.value).length}}" rowHeight="{{rowHeight}}" gutterSize="10">
                          <md-grid-tile *ngFor="let key of getJsonFieldKeys(field.value)">
                            <md-input placeholder="{{key}}" [formControlName]="getFormControlName(field, key)"></md-input>  
                          </md-grid-tile>
                        </md-grid-list>
                    </div>
                    
                    <!-- Image Field -->
                    <div *ngSwitchCase="'image'" >
                      <amp-file-upload-display [label]="field.name" [data]="field.value" (onFileSelect)="handleFileSelect.call(this, $event, field.name)"></amp-file-upload-display>  
                    </div>
                    
                    <!-- Image Field -->
                    <div *ngSwitchCase="'select'">
                        <md-select [formControlName]="field.name" placeholder="{{field.label}}">
                          <md-option [value]="opt" *ngFor="let opt of field.options">{{ opt }}</md-option>
                        </md-select>
                    </div>
                    
                    <!-- Switch Field -->
                    <div *ngSwitchCase="'switch'" class="relative switch-field">
                      <label class="md-input-placeholder md-float">{{field.label}}</label>
                      <md-slider min="0" max="1" step="1" [formControlName]="field.name" value="{{field.value ? 1 : 0}}"></md-slider>
                    </div>
                    
                  </div>
                  <span *ngIf="field.icon" md-suffix>
                    <md-icon>{{field.icon}}</md-icon>
                  </span>
                </md-grid-tile>  
              </md-grid-list >
              
              <md-grid-list cols="1" rowHeight="{{rowHeight}}" gutterSize="{{gutterSize}}" class="buttons">
                <md-grid-tile>
                  <amp-async-button label="{{saveLabel}}" labelActive="{{saveLabelActive}}" [disabled]="!form.valid" [asyncActive]="formActive"></amp-async-button>
                
                  <!--<button md-raised-button color="primary"  type="submit" [disabled]="!form.valid"></button>-->
                </md-grid-tile>
              </md-grid-list>
              
          
            </form>
       </md-card-content>
  `
})
export class AmpedFormComponent implements OnInit, OnChanges {
  
  @Input() data: FormDataInterface = {action: '', method: 'get', fields: []};
  @Input() saveLabel: string = 'Save'; // @TODO don't like passing this as a value. Maybe pass it as part of the data?
  @Input() saveLabelActive: string = 'Saving'; // @TODO don't like passing this as a value. Maybe pass it as part of the data?
  @Input() model: string;
  @Input() rowHeight: number = 65;
  @Input() gutterSize: number = 10;
  
  @Input() title: string = null;
  @Input() hideTitle: string = 'false';
  
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  
  public formControls: any = {};
  public fields: Array<FieldInterface> = [];
  public hiddenFields: any = [];
  public form: FormGroup;
  
  private formActive : boolean = false;
  
  private _fieldDefaults: Object = {
    label: 'My Field',
    name: 'my_field',
    value: '',
    type: 'text',
    required: false,
    options: []
  };
  
  constructor(private _fb: FormBuilder, private ampedService: AmpedService) {
  }
  
  ngOnInit() {
    this.buildForm();
    
  }
  
  ngOnChanges(changes: any) {
    if ( typeof changes.data.currentValue.action !== 'undefined' &&
        typeof changes.data.currentValue.fields !== 'undefined' )
      this.buildForm();
    // @TODO use an Observable
    
  }
  
  mapDataDefaults() {
    this.separateHiddenFields();
    this.fields = this.data.fields.map((rows: any) => {
      return rows.map((field: FieldInterface) => Object.assign({}, this._fieldDefaults, field));//Object.assign({}, this._fieldDefaults, field) )
    });
  }
  
  separateHiddenFields() {
    this.data.fields = this.data.fields.filter((row: any) => {
      return row.filter((field: FieldInterface) => {
          if (typeof field.type !== 'undefined' && field.type === 'hidden') {
            this.hiddenFields = [...this.hiddenFields, field];
            return false;
          }
          return true;
        }).length > 0;
    })
  }
  
  buildForm() {
    if (typeof this.data.fields !== 'undefined') {
      this.mapDataDefaults();
      this.formControls = this.fields.concat([this.hiddenFields]).reduce((ret: any, row: any) => {
        row.forEach((field: any) => {
          if (typeof field.value === 'object') {
            Object.keys(field.value).forEach((name) => {
              ret[`${field.name.toString()}.${name}`] = new FormControl(field.value[name]);
            })
          } else {
            ret[field.name.toString()] = field.required ?
              new FormControl(field.value, Validators.required) :
              new FormControl(field.value);
          }
        });
        
        return ret;
        
      }, {});
      
      this.form = new FormGroup(this.formControls);
    }
  }
  
  getColumnWidth(cols: any) {
    return Math.ceil(cols / 12);
  }
  
  getJsonFieldKeys(json: any) {
    return Object.keys(json);
  }
  
  getFormControlName(field: any, name: any) {
    return `${field.name.toString()}.${name}`;
  }
  
  getRowHeight(row: any) {
    return row.filter((r: any) => r.type === 'image').length > 0 ? 110 : this.rowHeight;
  }
  
  handleFileSelect(data: any, controlName: string) {
    Object.keys(data).forEach((key) => {
      if (typeof this.formControls[`${controlName}.${key}`] === 'undefined') {
        const ctrlName = `${controlName}.${key}`
        this.formControls[ctrlName] = new FormControl(data[key]);
        this.form.addControl(ctrlName, this.formControls[ctrlName]);
        this.form.removeControl(controlName);
      } else
        this.formControls[`${controlName}.${key}`].setValue(data[key])
    });
    // this.formControls[controlName].setValue(data);
  }
  
  
  // @TODO add error handler if this.data.action is undefined
  onFormSubmit() {
    this.formActive = true;
    this.ampedService[(typeof this.data.method === 'undefined' ? 'get' : this.data.method.toLowerCase())](this.data.action, this.form.value)
      .then((resp: any) => {
      this.formActive = false;
        this.onSubmit.emit(resp)
      });
  }
  
  getFormTitle() {
    if (this.title !== null)
      return this.title;
    else if (this.model && this.model !== '')
      return `Editing ${this.model}`;
    else
      return false;
  }
}
