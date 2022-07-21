import { Injectable } from '@angular/core';
import { Region } from '../utils/region';
import { regions } from '../utils/regions';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  regions: Region[] = regions;
  constructor() { }

  getRegions(){
    return this.regions;
  }

  addRegion(value: string, viewValue: string, border: any[]){
    this.regions.push(new Region(value, viewValue, border));
  }
}
