import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'format'
})

export class AmpedFormatPipe implements PipeTransform {
  transform(val: any, method: string ): any {
    return this[method].apply(this, [val, ...Array.prototype.slice.call(arguments).slice(2)]);
  }
  
  capitalize(value){
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  
  slugtotitle(value){
    return value.toString()
      .replace(/(-|_|\.)/g, ' ')
      .replace(/\b\w/g, function(l){ return l.toUpperCase() });
  }
}
