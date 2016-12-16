import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ampedfilter'
})

export class AmpedFilterPipe implements PipeTransform {
  transform(items: any[], fields: Array<string>, value: string): any {
    if (items.length === 0 || typeof value === 'undefined' || value.trim() === '' )
      return items;
    
    console.log(items);
    return items.filter(item => {
      return fields.filter(field => item[field].toString().indexOf(value) !== -1).length > 0
    })
  }
}
