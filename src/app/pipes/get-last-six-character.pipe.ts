import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'lastSixCharacter',
    pure: false
})

export class GetLastSixCharacter implements PipeTransform {
    transform(val:any) {
    	var tmp = val.toString();
    	var str = tmp.substr(4,6);
    return  str;
  }
}