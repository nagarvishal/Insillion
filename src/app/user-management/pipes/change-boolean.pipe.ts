import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeBoolean'
})
export class ChangeBooleanPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (value == 1) {
      return "Active";
    }
    else {
      return "Disactive";
    }
  }
}
@Pipe({ name: 'capitalisation' })
export class Capitalisation implements PipeTransform {
  transform(value: string, args?: any): any {
      if (value != undefined && value != '') {
          let str:string = "";
          let returnValue:string = "";
          const words = value.split(" ");
          for(let index=0;index<words.length;index=index+1){
              str = words[index][0].toUpperCase();words[index] = words[index].substring(1);words[index] = str+words[index];
              if(index==words.length-1)
                  returnValue=returnValue+words[index];
              else
                  returnValue=returnValue+words[index]+' ';
          }
          return returnValue;
      }
  }
}
