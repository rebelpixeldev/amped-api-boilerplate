import { Injectable } from '@angular/core';
import {MdSnackBar, MdSnackBarConfig} from "@angular/material";
import {AmpAlertSnackSuccess, AmpAlertSnackError} from "./amped.alerts.snacks";


@Injectable()
export class AmpedAlertService {
  
  private config : MdSnackBarConfig;
  
  constructor(private snack : MdSnackBar) {
    this.config = new MdSnackBarConfig();
    // this.config.duration = 1000; //@TODO Duration isn't in there for some reason
    
  }
  
  snackSuccess( message: string = '', actionLabel : string = '', icon : string = 'check' ){
    const ref : any = this.snack.openFromComponent(AmpAlertSnackSuccess, this.config);
    ref.instance.message = message;
    ref.instance.actionLabel = actionLabel;
    console.log(ref);
  }
  
  snackError( message: string = '', actionLabel : string = '', icon : string = 'check' ){
    const ref : any = this.snack.openFromComponent(AmpAlertSnackError, this.config);
    ref.instance.message = message;
    ref.instance.actionLabel = actionLabel;
  }
  
}

