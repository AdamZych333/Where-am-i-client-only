import { Injectable } from '@angular/core';
import { MapLoaderService } from './map-loader.service';
import { RandomStreetviewService } from './random-streetview.service';
import { RegionService } from './region.service';
import { StreetViewService } from './street-view.service';

export class Map{
  constructor(public value: string, public viewValue: string, public lat: number, public lng: number){}
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  maps: Map[] = []
  generationTime = 10;
  selectedMap = this.maps[0];

  constructor(private regionService: RegionService, randomStreetView: RandomStreetviewService) {
    // regionservice.selectedregion.border => generate maps with seed
    randomStreetView.getRandomLocations(20).then(res => {
      res.forEach((r: any, i) => {
        this.maps.push(new Map((i+1).toString(), (i+1).toString(),  r[0], r[1]));
      })
    })
  }

  getCurrentGenerationSeed(){
    const currentDate = new Date();
    return `${currentDate.getUTCFullYear()}${currentDate.getUTCMonth()}${currentDate.getUTCDate()}${currentDate.getUTCHours()}${Math.floor(currentDate.getUTCMinutes()/10)}${this.selectedMap.value}`
  }

  getTimeLeftToNextGeneraton(){
    const currentDate = new Date();
    return {minutes: this.generationTime-1 - Math.floor(currentDate.getUTCMinutes()%this.generationTime), seconds: 60 - currentDate.getUTCSeconds()};
  }
}
