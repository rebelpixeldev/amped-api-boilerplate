import { MaterialModule }     from '@angular/material';
import {NgModule}             from "@angular/core";

import {AmpAlertSnackSuccess, AmpAlertSnackError} from './amped.alerts.snacks';
import { AmpedAlertService } from './amped.alert.service';
import {AlertConfirmDialog, AlertsConfirmDialogDirective} from "./amped.alerts.confirm";

const exportDeclarations : Array<any> = [
  AmpAlertSnackSuccess, AmpAlertSnackError, AlertConfirmDialog, AlertsConfirmDialogDirective
];

@NgModule({
  imports         : [ MaterialModule.forRoot() ],
  declarations    : exportDeclarations,
  exports         : exportDeclarations,
  providers       : [ AmpedAlertService ],
  entryComponents : [ AmpAlertSnackSuccess, AmpAlertSnackError, AlertConfirmDialog ]
})
export class AmpedAlertModule {}
