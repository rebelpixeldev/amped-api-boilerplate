import {Component, OnInit, Input, Output, OnChanges} from '@angular/core';
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
  fields: Array<Object>;
}

@Component({
  moduleId: module.id,
  selector: 'amped-form',
  template: `

       <md-card-title *ngIf="model && model !== ''">Editing {{model}}</md-card-title>  
       <md-card-content>
            <form *ngIf="form" (ngSubmit)="onSubmit()" [formGroup]="form">
              <md-grid-list *ngFor="let row of fields" cols="{{row.length}}" rowHeight="{{rowHeight}}" gutterSize="{{gutterSize}}">
                <md-grid-tile *ngFor="let field of row" >
                  <div [ngSwitch]="field.type" class="amped-form-element">
                    <!-- Hidden input @TODO hidden here still adds a figure and is styled which takes up space on the form. 
                     Either add hidden fields to the response afterwards or pull the out beforehand and append before the loops-->
                         <!--<input *ngSwitchCase="'hidden'" type="hidden" [formControlName]="field.name" />-->
                    <!-- Text input -->
                        <md-input *ngSwitchCase="'text'" placeholder="{{field.label}}" [formControlName]="field.name"></md-input>
                        <md-input *ngSwitchCase="'password'" type="password" placeholder="{{field.label}}" [formControlName]="field.name"></md-input>
                        
                        <!--<md-input *ngSwitchCase="'json_text'" placeholder="{{field.label}}" [formControlName]="field.name"></md-input>-->
                   
                    <!-- Number input -->
                      <div *ngSwitchCase="'json_text'">
                          <md-grid-list cols="{{getJsonFieldKeys(field.value).length}}" rowHeight="{{rowHeight}}" gutterSize="10">
                            <md-grid-tile *ngFor="let key of getJsonFieldKeys(field.value)">
                              <md-input placeholder="{{key}}" [formControlName]="getFormControlName(field, key)"></md-input>
                            </md-grid-tile>
                          </md-grid-list>
                      </div>
                         <input *ngSwitchCase="'number'" type="number" class="form-control" [formControlName]="field.name" />
                    
                    <!-- Email input -->
                         <input *ngSwitchCase="'email'" type="email" class="form-control" [formControlName]="field.name" />
                    
                    <!-- Email input -->
                      <amp-file-upload-display 
                        *ngSwitchCase="'image'" 
                        [data]="field.value" (onFileSelect)="handleFileSelect.call(this, $event, field.name)"></amp-file-upload-display>
                      <!--<img [src]="field.value" alt="">-->
                      <div *ngSwitchCase="'select'" class="col-xs-12">
                          <label for="">{{field.label}}</label>
                          <select class="form-control" [formControlName]="field.name">
                              <option *ngFor="let option of field.options" [value]="option.value">{{option.label}}</option>
                          </select>
                      </div>
                    </div>
                    <span *ngIf="field.icon" md-suffix>
                      <md-icon>{{field.icon}}</md-icon>
                    </span>
                  </md-grid-tile>  
                </md-grid-list >
              
              <md-grid-list cols="1" rowHeight="{{rowHeight}}" gutterSize="{{gutterSize}}" class="buttons">
                <md-grid-tile>
                  <button md-raised-button color="primary"  type="submit" [disabled]="!form.valid">{{saveLabel}}</button>
                </md-grid-tile>
              </md-grid-list>
              
          
            </form>
       </md-card-content>
  `
})
export class AmpedFormComponent implements OnInit, OnChanges {

  @Input() data: FormDataInterface = {action: '', fields: []};
  @Input() saveLabel : string = 'Save'; // @TODO don't like passing this as a value. Maybe pass it as part of the data?
  @Input() model : string;

  @Input() rowHeight : number = 65;
  @Input() gutterSize : number = 10;

  public formControls: any = {};
  public fields: Array<FieldInterface> = [];
  public form: FormGroup;

  private _fieldDefaults: Object = {
    label: 'My Field',
    name: 'my_field',
    value: '',
    type: 'text',
    required: false,
    options: []
  };

  constructor(private _fb: FormBuilder, private ampedService : AmpedService) {
  }

  ngOnInit() {
    this.buildForm();

  }

  ngOnChanges(changes: any) {
    this.buildForm();
    // @TODO use an Observable

  }

  mapDataDefaults() {
    this.fields = this.data.fields.map((rows: any) => {
      return rows.map((field: FieldInterface) => Object.assign({}, this._fieldDefaults, field));//Object.assign({}, this._fieldDefaults, field) )
    });
  }

  buildForm() {
    if (typeof this.data.fields !== 'undefined') {
      this.mapDataDefaults();
      this.formControls = this.fields.reduce((ret: any, row: any) => {
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

  handleFileSelect(data : any, controlName : string){
    Object.keys(data).forEach(( key ) => this.formControls[`${controlName}.${key}`].setValue(data[key]) );
    // this.formControls[controlName].setValue(data);
  }

  onSubmit() {
    console.log('Submit');
    console.log(this.data.action);
    console.log(this.form.value);

    this.ampedService.put(this.data.action, this.form.value);
  }
}
