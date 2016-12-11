import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';

import { AmpedService } from '../common/amped.common.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AmpedAuthService {
  
  
  constructor(private ampedService : AmpedService) {
  }
  
  // submitForm(action : string, data : any, method : string = 'POST', headers : any = {}) : any{
  //   this.http[method.toLowerCase()](action, data, { headers })
  //     .toPromise()
  //     .then((resp : any) => {
  //       resp.json()
  //     })
  //     .then((resp : any) => {
  //       console.log(resp);
  //     })
  // }
  //
  getCrudData(model : string, id : string = '' ) : Promise<any>{
    return this.ampedService.request(id === '' ? `/api/${model}` : `/api/${model}/edit/${id}`);
  }
  
}
