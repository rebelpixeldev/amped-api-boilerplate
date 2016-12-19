import { Injectable } from '@angular/core';

@Injectable()
export class AmpedChartService {

    constructor() { }
  
  formatByDay(data : any){
    
  }
  
  formatApiData(data : any, durationDays : number = 30, dataIndex : string = 'created_at') {
    console.log('* * * * * * * * * * * * * * * * *');
    const
      toDate: Date = new Date(),
      fromDate: Date = new Date();
    
    toDate.setDate(toDate.getDate() + 2); // @TODO timezones are fucking everything up
    fromDate.setDate(fromDate.getDate() - durationDays);
  
    const dataArr = {};
  
    while (fromDate < toDate) {
      dataArr[this.formatDate(fromDate)] = 0;
      fromDate.setDate(fromDate.getDate() + 1);
    }
    
    console.log(Object.assign({}, dataArr));
  
    data.forEach((row : any) => {
      dataArr[this.formatDate(new Date(row[dataIndex].replace('T', ' ').replace('Z', '')))] += 1;
    });
  
    return dataArr;
  }
  
  formatDate(date : Date){
    return `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;
  }
  
}
