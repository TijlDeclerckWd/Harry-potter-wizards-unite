import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'cutTooLongSentencesPipe'})
export class CutTooLongSentencesPipe implements PipeTransform {
  transform(string) {
    return string.length > 100 ? string.slice(0, 100) + '...' : string;
  }
}
