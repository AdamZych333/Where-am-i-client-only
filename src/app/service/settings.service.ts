import { Injectable } from '@angular/core';
import { Map } from '../utils/map';
import { Region } from '../utils/region';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  generationTime = 10;
  numberOfMaps = 20;
  maps: Map[] = <Map[]>[];
  selectedMap: Map;
  regions: Region[] = [
    new Region('world', 'The World', []),
  ]
  selectedRegion = this.regions[0];
  
  constructor() {
    for(let i = 0; i < this.numberOfMaps; i++){
      this.maps.push(new Map((i+1).toString(), (i+1).toString()));
    }
    this.selectedMap = this.maps[0];
  }

  getCurrentGenerationSeed(map: Map): number{
    const currentDate = new Date();
    return +`${currentDate.getUTCFullYear()}${currentDate.getUTCMonth()}${currentDate.getUTCDate()}${currentDate.getUTCHours()}${Math.floor(currentDate.getUTCMinutes()/this.generationTime)}${map.value}`
  }

  getTimeLeftToNextGeneraton(){
    const currentDate = new Date();
    return {minutes: this.generationTime-1 - Math.floor(currentDate.getUTCMinutes()%this.generationTime), seconds: 60 - currentDate.getUTCSeconds()};
  }
}
