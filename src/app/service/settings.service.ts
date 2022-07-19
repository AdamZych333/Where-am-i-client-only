import { Injectable } from '@angular/core';
import { Map } from '../utils/map';
import { Region, regions } from '../utils/region';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  generationTime = 10;
  numberOfMaps = 20;
  maps: Map[] = <Map[]>[];
  selectedMap: Map;

  selectedRegion = regions[0];
  started: boolean = false;
  
  timerValue = 180;
  timer: any;
  
  constructor() {
    for(let i = 0; i < this.numberOfMaps; i++){
      this.maps.push(new Map((i+1).toString(), (i+1).toString(), 0, 0));
    }
    this.selectedMap = this.maps[0];
  }

  getCurrentGenerationSeed(map: Map): string{
    const currentDate = new Date();
    return `${currentDate.getUTCFullYear()}${currentDate.getUTCMonth()}${currentDate.getUTCDate()}${currentDate.getUTCHours()}${Math.floor(currentDate.getUTCMinutes()/this.generationTime)}${map.value}`
  }

  getTimeLeftToNextGeneraton(){
    const currentDate = new Date();
    return {minutes: this.generationTime-1 - Math.floor(currentDate.getUTCMinutes()%this.generationTime), seconds: 60 - currentDate.getUTCSeconds()};
  }
}
