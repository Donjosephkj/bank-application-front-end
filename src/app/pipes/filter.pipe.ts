import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(AllTransaction:[],searchKey:string,propName:string): any [] {
    const result:any=[]
    if(!AllTransaction || searchKey=='' || propName==''){
      return AllTransaction
    }
    AllTransaction.forEach((item:any)=>{
      if(item[propName].trim().toLowerCase().includes(searchKey.toLowerCase())){
        result.push(item)
      }
    })
    return result;
  }

}
