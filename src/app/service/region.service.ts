import { Injectable } from '@angular/core';
import { Region } from '../utils/region';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  regions: Region[] = [
    new Region('world', 'The World', []),
  ]
  constructor() { }

  getRegions(){
    return this.regions;
  }

  addREgion(value: string, viewValue: string, border: []){
    console.log(`Added new region: ${border}`);
    this.regions.push(new Region(value, viewValue, border));
  }
}
