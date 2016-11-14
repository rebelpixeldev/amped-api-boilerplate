import {Pipe} from '@angular/core';

@Pipe({ name: 'slugtotitle' })
export class SlugtotitlePipe {
  transform(value: string, args: string[]): any {
    
    return value.toString()
      .replace(/(-|_|\.)/g, ' ')
      .replace(/\b\w/g, function(l){ return l.toUpperCase() });
  }
}
