import {Component, OnInit}    from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
import { AmpedFormsService }  from './amped.crud.service';
import {AmpedSocketService} from "../socket/amped.socket.service";

@Component({
  moduleId: module.id,
  selector: 'amped-crud-table',
  template: `
    <md-card>
       <md-card-header>
          <md-card-title><h1>{{model | format : 'capitalize'}} List</h1></md-card-title>
          <span class="fill-remaining-space"></span>
          <button md-raised-button  amp-create-crud-dialog-trigger
                color="primary"
                [model]="model">
             <md-icon >add</md-icon>Add New
          </button>
       </md-card-header>
       <md-card-content>
          <amped-table [data]="tableData" enableCrud="true" (onDelete)="handleEntryDelete($event)"></amped-table>
       </md-card-content>
    </md-card>
`
})
export class AmpedCrudTableComponent implements OnInit {

  public tableData : Array<any> = [];

  private model : string = '';

  private sub : any;


  constructor(private FormService: AmpedFormsService, private route: ActivatedRoute, private socketService : AmpedSocketService) {
  }

  ngOnInit() {
    
    this.sub = this.route.params.subscribe(params => {
      const {model, id} = params;
      
      this.model = model;
      
      // @TODO this listener needs to be added outside of the subscribe
      this.socketService.addSocketListener(`${this.model.toUpperCase()}_UPDATE`, (payload : any) => {
        this.tableData = [payload.user, ...this.tableData];
      });
  
      this.socketService.addSocketListener(`${this.model.toUpperCase()}_DELETE`, (payload : any) => {
        this.tableData = this.tableData.filter(( row ) => row.id !== parseInt(payload.id));
      })
      
      // Retrieve Pet with Id route param
      this.FormService.getCrudData(model).then(data => {
        this.tableData = data.response;
      });
    });
  }
  
  handleEntryDelete(data : any){
    console.log('ENTRY', data);
  
    this.FormService.deleteCrudEntry(this.model, data.entry.id);
    
  }

}
