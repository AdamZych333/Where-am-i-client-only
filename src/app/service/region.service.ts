import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  regions = [
    {value: 'world', viewValue: 'The World', border: []},
  ]
  selectedRegion = this.regions[0];

  constructor() { }
}
