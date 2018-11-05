import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'msToDatePipe'})
export class MsToDatePipe implements PipeTransform {
  transform(value) {
    return new Date(value);
  }
}
