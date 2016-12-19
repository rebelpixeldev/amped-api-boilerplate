import 'chart.js';

import { MaterialModule }     from '@angular/material';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import {ChartsModule}         from 'ng2-charts/ng2-charts';

import { AmpedService }       from '../common/amped.common.service';

import { AmpedChartLine }     from './amped.chart.line.component';
import { AmpedChartService }  from './amped.chart.service';



@NgModule({
  imports         : [ CommonModule, MaterialModule.forRoot(), ChartsModule ],
  declarations    : [ AmpedChartLine ],
  exports         : [ AmpedChartLine ],
  providers       : [ AmpedService, AmpedChartService ],
  entryComponents : [  ]
})
export class AmpedChartModule {}
