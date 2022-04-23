import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public loadLocal(key: string): string{
    return localStorage.getItem(key) ?? '';
  }

  public storeLocal(key: string, value: string){
    localStorage.setItem(key, value);
  }

  public deleteLocal(key: string){
    localStorage.deleteItem(key);
  }
}
