import { Injectable } from '@angular/core';
import {MdSnackBar, MdSnackBarConfig} from "@angular/material";
import {AmpAlertSnackSuccess, AmpAlertSnackError} from "./amped.alerts.snacks";


@Injectable()
export class AmpedAlertService {
  
  private config : MdSnackBarConfig;
  
  constructor(private snack : MdSnackBar) {
    this.config = new MdSnackBarConfig();
    this.config.duration = 3000;
    
  }
  
  snackSuccess( message: string = '', actionLabel : string = '', icon : string = 'check' ){
    const ref : any = this.snack.openFromComponent(AmpAlertSnackSuccess, this.config);
    ref.instance.message = message;
    ref.instance.actionLabel = actionLabel;
  }
  
  snackError( message: string = '', actionLabel : string = '', icon : string = 'check' ){
    const ref : any = this.snack.openFromComponent(AmpAlertSnackError, this.config);
    ref.instance.message = message;
    ref.instance.actionLabel = actionLabel;
  }
  
}

