import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';

import { AmpedService } from '../common/amped.common.service';
import { AmpedAuthService } from '../auth/amped.auth.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AmpedFilesService{
  
  constructor(private ampedService : AmpedService) {
  }
  
  getFiles() : Promise<any>{
    return this.ampedService.request('/api/uploads');
  }
  
  uploadFile(formData : FormData) : Promise<any>{
    return this.ampedService.request('/uploads/upload', formData, {}, 'post')
  }
  
}
