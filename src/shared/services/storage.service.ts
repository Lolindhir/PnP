import { Injectable } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private fileSaver: FileSaverService) { 

  }

  public loadLocal(key: string): string{
    return localStorage.getItem(key) ?? '';
  }

  public storeLocal(key: string, value: string){
    localStorage.setItem(key, value);
  }

  public deleteLocal(key: string){
    localStorage.removeItem(key);
  }

  public storeJson(fileName: string, content: string){

    const blob = new Blob([content], { type: 'application/json'});
    this.fileSaver.save(blob, fileName);

  }

  public storeCsv(fileName: string, data: any, withHeader: boolean) {
    
    const replacer = (key : any, value: any) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map((row: { [x: string]: any; }) => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    
    //with or without header
    if(withHeader){
      csv.unshift(header.join(';'));
    }
   
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    this.fileSaver.save(blob, fileName);
  }

}
