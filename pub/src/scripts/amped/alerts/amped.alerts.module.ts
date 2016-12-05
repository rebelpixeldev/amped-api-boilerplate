import { MaterialModule }     from '@angular/material';
import {NgModule}             from "@angular/core";

import {AmpAlertSnackSuccess, AmpAlertSnackError} from './amped.alerts.snacks';
import { AmpedAlertService } from './amped.alert.service';

const exportDeclarations : Array<any> = [
  AmpAlertSnackSuccess, AmpAlertSnackError
];

@NgModule({
  imports         : [ MaterialModule.forRoot() ],
  declarations    : exportDeclarations,
  exports         : exportDeclarations,
  providers       : [ AmpedAlertService ],
  entryComponents : [ AmpAlertSnackSuccess, AmpAlertSnackError ]
})
export class AmpedAlertModule {}
