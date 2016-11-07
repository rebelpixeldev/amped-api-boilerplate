import {Pipe} from '@angular/core';

/**
 * Truncate a string to the given length and append suffix.
 * @param	length Text max length. Default 20.
 * @param	suffix Appended to the end of the string if truncted. Default ''.
 * @example Usage:
 * ```html
 * <p>{{ 'Hello world' | truncate:5:'...' }}</p>
 * <!-- Formats to: 'Hello...' -->
 * ```
 */
@Pipe({ name: 'truncate' })

export class TruncatePipe {
  transform(value: string, args: string[]): any {
    const
      length = typeof args === 'undefined' ? 20 : parseInt(args[0] || '20', 10),
      suffix = typeof args === 'undefined' ? '...' : args[1] || '...';
    
    value = value.toString();
    
    if (value.length <= length)
      return value;
    
    return value.substring(0, length) + suffix;
  }
}
