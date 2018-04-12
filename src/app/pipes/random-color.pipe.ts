import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'randomColor',
    pure: true
})

export class RandomColor implements PipeTransform {
    transform(val:string) {
    	var randomColor1 = '#'+Math.floor(Math.random()*16777215).toString(16);
    	return randomColor1;
    	// var r = function () { return Math.floor(Math.random()*256).toString() };
    	// return "rgb(" + r() + "," + r() + "," + r() + ")";
  }
}