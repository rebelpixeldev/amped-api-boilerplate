import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';

import { AmpedAuthService } from '../auth/amped.auth.service';
import {AmpedAlertService} from "../alerts/amped.alert.service";

interface AmpedRESTInterface{
  success : boolean;
  message : string;
  meta    : Object;
  response: any;
}

@Injectable()
export class AmpedService {

  private user : any = null;

  constructor(private http : Http, private alertService : AmpedAlertService){
  }

  getUser(){
    if ( this.user === null) {
      return this.http.get('/user')
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
  
  get(url : any, data : any = {}, options : any = {}, reqMethod : string = 'get' ){
    return this.request.apply(this, arguments);
  }
  
  post(url : any, data : any = {}, options : any = {}, reqMethod : string = 'post' ){
    return this.request.apply(this, [url, data, options, 'post']);
  }
  put(url : any, data : any = {}, options : any = {}){
    return this.request.apply(this, [url, data, options, 'put']);
  }
  delete(url : any, data : any = {}, options : any = {}, reqMethod : string = 'delete' ){
    return this.request.apply(this, [url, data, options, 'delete']);
  }
  
  request(url : any, data : any = {}, options : any = {}, reqMethod : string = 'get' ){
    
    return new Promise((resolve, reject) => {

      this.appendToken(url)
        .then( (url:string) => {

          const method = (reqMethod || data.method ).toLowerCase();
          delete data.method;
          
          console.log(method);


          this.http[method](url, data, options)
            .toPromise()
            .then( ( resp : any ) => resp.json() )
            .then(( resp : any ) =>{
              if ( resp.success ){
                // @TODO plan for meta to be sent as well
                resolve(resp);
              } else {
                reject(resp.message);
              }
            }).catch((err : any) => {
            })
        })
    })

  }


  appendToken(url : any) : any{

    return new Promise((resolve, reject) => {
      this.getUser()
        .then((user : any) => {
          resolve(
            typeof user.token === 'undefined' ?
              url : url + (url.indexOf('?') === -1 ? '?token=' + user.token : `&${user.token}`)
          );
        });
      // @TODO handle error
    })







  }


}
