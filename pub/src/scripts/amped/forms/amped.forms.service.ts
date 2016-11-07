import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AmpedFormsService {

    constructor(private http : Http) { }
  
  submitForm(action : string, data : any, method : string = 'POST', headers : any = {}) : any{
    this.http[method.toLowerCase()](action, data, { headers })
      .toPromise()
      .then((resp : any) => {
        resp.json()
      })
      .then((resp : any) => {
          console.log(resp);
      })
  }
  
  getCrudData(model : string, id : string = '' ) : Promise<any>{
    return this.http.get(id === '' ? `/api/${model}` : `/api/${model}/edit/${id}`)
      .toPromise()
      .then(resp => resp.json());
      // .then((resp) => {
      //
      //   this.formData = {
      //     action : '/api/users/1',
      //     fields : resp
      //   }
      // });
  }

}
