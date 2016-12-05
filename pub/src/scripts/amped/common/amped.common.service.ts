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

  request(url : any, data : any = {}, options : any = {}, reqMethod : string = 'get' ){

    return new Promise((resolve, reject) => {

      this.appendToken(url)
        .then( (url:string) => {

          const method = (data.method || reqMethod).toLowerCase();
          delete data.method;


          this.http[method](url, data, options)
            .toPromise()
            .then( ( resp : any ) => resp.json() )
            .then(( resp : any ) =>{
              if ( resp.success ){
                // @TODO plan for meta to be sent as well
                resolve(resp.response)
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
          //@TODO fix this. looks like shit and too tired
          url = url + (url.indexOf('?') === -1 ? '?token=' + user.token : `&${user.token}`);
          resolve(url);

        });
      // @TODO handle error
    })







  }


}
