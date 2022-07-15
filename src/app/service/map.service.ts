import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  maps = Array(20).fill(0).map((v, i) => {return {value: i, viewValue: i+1}})
  generationTime = 10;
  selectedMap = this.maps[0];

  constructor() { }

  getCurrentGenerationSeed(){
    const currentDate = new Date();
    return `${currentDate.getUTCFullYear()}${currentDate.getUTCMonth()}${currentDate.getUTCDate()}${currentDate.getUTCHours()}${Math.floor(currentDate.getUTCMinutes()/10)}${this.selectedMap.value}`
  }

  getTimeLeftToNextGeneraton(){
    const currentDate = new Date();
    return {minutes: this.generationTime-1 - Math.floor(currentDate.getUTCMinutes()%this.generationTime), seconds: 60 - currentDate.getUTCSeconds()};
  }
}
