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
  
  get(url: any, data: any = {}, options: any = {}, reqMethod: string = 'get') {
    return this.request.apply(this, arguments);
  }
  
  post(url: any, data: FormData, options: any = {}, reqMethod: string = 'post') {
    return this.request.apply(this, [url, data, options, 'post']);
  }
  
  put(url: any, data: FormData = new FormData(), options: any = {}) {
    return this.request.apply(this, [url, data, options, 'put']);
  }
  
  delete(url: any, data: any = {}, options: any = {}, reqMethod: string = 'delete') {
    return this.request.apply(this, [url, data, options, 'delete']);
  }
  
  request(url: any, data: FormData = new FormData(), options: any = {}, reqMethod: string = 'get') {
    
    return new Promise((resolve, reject) => {
      
      
      const method = reqMethod.toLowerCase();
      
      
      let headers = new Headers(Object.assign({}, (typeof options.headers === 'undefined' ? {} : options.headers)));
      headers.append('Authorization', localStorage.getItem('token'));
      
      options = Object.assign({}, options, {headers});
      
      if ( method === 'get')
        data = options;
      
      
      this.http[method](url, data, options)
        .toPromise()
        .then((resp: any) => resp.json())
        .then((resp: any) => {
          if (resp.success) {
            // @TODO plan for meta to be sent as well
            resolve(resp);
          } else {
            reject(resp.message);
            throw resp.message
          }
        }).catch((err: any) => {
        console.error(err);
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
