import {FormControl} from '@angular/forms';

export function  isInvalidHouse(c: FormControl): any {
  if (c.value) {
    const house = c.value.toLowerCase().trim();
    if (!(house === 'slytherin' || house === 'gryffindor' || house === 'hufflepuff' || house === 'ravenclaw' )) {
      return {isInvalidHouse: true};
    } else {
      return null;
    }
  }
  return null;
}
