import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {AmpedChartService} from "./amped.chart.service";
import {AmpedSocketService} from "../socket/amped.socket.service";

@Component({
  moduleId: module.id,
  selector: 'amp-chart-line',
  template: `
      <div *ngIf="chartData !== null" style="display: block;">
    <canvas baseChart width="400" height="400"
                [datasets]="chartData"
                [labels]="chartLabels"
                [options]="options"
                [colors]="lineChartColors"
                [legend]="showLegend"
                [chartType]="chartType"
                (chartHover)="chartHovered($event)"
                (chartClick)="chartClicked($event)"></canvas>
    </div>
    `
})
export class AmpedChartLine implements OnInit, OnChanges {
  
  @Input() data: any = [];
  @Input() showLegend : boolean = false;
  @Input() options : any = {
    animation : false,
    // animation: {
    //   easingFunction : 'easeout',
    //   duration : 500
    // },
    responsive: true,
    maintainAspectRatio: false
  };
  
  @Input() socketEvent : string = null;
  
  @Input() apiData : boolean = true;
  
  private chartType : string = 'line';
  private chartData : Array<any> = null;
  private chartLabels : Array<string> = [];
  
  constructor(private chartService : AmpedChartService, private socketService : AmpedSocketService ) {
  }
  
  ngOnInit(){
    if ( this.socketEvent !== null )
      this.socketService.getObservable(this.socketEvent).subscribe(this.onSocketCreate.bind(this));
  }
  
  ngOnChanges(changes : any){
    if ( typeof changes.data !== 'undefined' ){
      this.updateChart();
    }
  }
  
  onSocketCreate(evt : any){
    this.data = [...this.data, evt];
    this.updateChart();
  }
  
  updateChart(){
    if ( this.apiData ) {
      const dataFull = this.chartService.formatApiData(this.data);
      this.chartLabels = Object.keys(dataFull);
      this.chartData = [
        {data: Object.keys(dataFull).map(( k : string ) => dataFull[k]), label: 'Date'}
      ];
    } else {
      // @TODO build in support for the chart data to just be passed
    }
  }
  
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  
  // // events
  public chartClicked(e:any):void {
    // console.log(e);
  }

  public chartHovered(e:any):void {
    // console.log(e);
  }
  
}
