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
}
