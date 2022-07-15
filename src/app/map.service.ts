import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  getCurrentGenerationSeed(){
    const currentDate = new Date();
    return `${currentDate.getUTCFullYear()}${currentDate.getUTCMonth()}${currentDate.getUTCDate()}${currentDate.getUTCHours()}${Math.floor(currentDate.getUTCMinutes()/10)}`
  }

  getTimeLeftToNextGeneraton(){
    const currentDate = new Date();
    return {minutes: 9 - Math.floor(currentDate.getUTCMinutes()%10), seconds: 60 - currentDate.getUTCSeconds()};
  }
}
