import { Pipe, PipeTransform } from '@angular/core';
import { THighlightRange } from './../models/search';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, ranges: THighlightRange[], tagname = 'mark'): string {
    const OPEN_TAG = `<${tagname}>`;
    const CLOSE_TAG = `</${tagname}>`;

    let result = '';
    let currentRangeIndex = 0;
    
    if (!ranges || ranges.length === 0) {
      return value;
    }
    
    for (let i = 0; i < value.length; i += 1) {
      const currentRange = ranges[currentRangeIndex];
      
      if (i === currentRange[0]) {
        result += OPEN_TAG;
      }
      
      if (i === currentRange[1]) {
        result += CLOSE_TAG;
        if (currentRangeIndex !== ranges.length - 1) {
          currentRangeIndex += 1;
        }
      }
      
      result += value[i];
    }
    return result;
  }

}
