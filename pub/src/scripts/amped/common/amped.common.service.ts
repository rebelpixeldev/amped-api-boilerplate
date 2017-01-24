import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

import {AmpedAuthService} from '../auth/amped.auth.service';
import {AmpedAlertService} from "../alerts/amped.alert.service";

interface AmpedRESTInterface {
  success: boolean;
  message: string;
  meta: Object;
  response: any;
}

@Injectable()
export class AmpedService {
  
  private user: any = null;
  
  constructor(private http: Http, private alertService: AmpedAlertService) {
  }
  
  getUser() {
    if (this.user === null) {
      
      let headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', localStorage.getItem('token'));
      
      return this.http.get('/user', {headers})
        .toPromise()
        .then((resp: any) => resp.json())
        .then((user: any) => this.user = user.response);
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.user);
        })
      })
    }
  }
  
  get(url: any, data: any = {}, options: any = {}, suppressSnack : boolean = false) {
    return this.request(url, data, options, 'get', suppressSnack);
  }
  
  post(url: any, data: any, options: any = {}, suppressSnack : boolean = false) {
    return this.request(url, data, options, 'post', suppressSnack);
  }
  
  put(url: any, data: any = {}, options: any = {}, suppressSnack : boolean = false) {
    return this.request(url, data, options, 'put', suppressSnack);
  }
  
  delete(url: any, data: any = {}, options: any = {},suppressSnack : boolean = false) {
    return this.request(url, data, options, 'delete', suppressSnack);
  }
  
  request(url: any, data: any = {}, options: any = {}, reqMethod: string = 'get', suppressSnack : boolean = false) {
    
    return new Promise((resolve, reject) => {
      
      
      const method = reqMethod.toLowerCase();
      
      
      let headers = new Headers(Object.assign({}, (typeof options.headers === 'undefined' ? {} : options.headers)));
      headers.append('Authorization', localStorage.getItem('token'));
      
      options = Object.assign({}, options, {headers});
      
      if ( method === 'get' || method === 'delete')
        data = options;
      
      this.http[method](url, data, options)
        .toPromise()
        .then((resp: any) => resp.json())
        .then((resp: any) => {
        
          if (resp.success) {
            if ( resp.message !== '' && !suppressSnack )
              this.alertService.snackSuccess(resp.message);
            // @TODO plan for meta to be sent as well
            resolve(resp);
          } else {
            // reject(resp);
            throw resp.message
          }
        }).catch((err: any) => {
        reject(err);
        if ( !suppressSnack )
          this.alertService.snackError(err);
      })
    })
    
  }
  
  
  appendToken(url: any): any {
    
    return new Promise((resolve, reject) => {
      this.getUser()
        .then((user: any) => {
          resolve(
            typeof user.token === 'undefined' ?
              url : url + (url.indexOf('?') === -1 ? '?token=' + user.token : `&${user.token}`)
          );
        });
      // @TODO handle error
    })
    
    
  }
  
  
}
