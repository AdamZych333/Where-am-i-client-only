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

  addRegion(value: string, viewValue: string, border: any[]){
    console.log(`Added new region: ${border}`);
    this.regions.push(new Region(value, viewValue, border));
  }
}
