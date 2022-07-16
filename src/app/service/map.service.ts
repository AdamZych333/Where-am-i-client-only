import { Injectable } from '@angular/core';
import { MapLoaderService } from './map-loader.service';
import { RandomStreetviewService } from './random-streetview.service';
import { Map } from '../utils/map';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  generationTime = 10;
  numberOfMaps = 20;
  maps: Map[] = <Map[]>[];
  selectedMap: Map;
  regions = [
    {value: 'world', viewValue: 'The World', border: []},
  ]
  selectedRegion = this.regions[0];

  constructor(private mapLoader: MapLoaderService, private randomStreetView: RandomStreetviewService) {
    for(let i = 0; i < this.numberOfMaps; i++){
      this.maps.push(new Map((i+1).toString(), (i+1).toString()));
    }
    this.selectedMap = this.maps[0];
  }

  async getCoordinates(){
    let seed = this.getCurrentGenerationSeed();
    console.log(seed)
    if(!this.selectedMap.hasSetCoordinates() || this.selectedMap.seed !== seed){
      this.selectedMap.seed = seed;
      this.randomStreetView.setParameters({
        border: this.selectedRegion.border,
        seed: seed,
        google: await this.mapLoader.load()
      })
      const location = await this.randomStreetView.getRandomLocation();
      this.selectedMap.setCoordinates(location[0], location[1]);
    }
    return {lat: this.selectedMap.lat, lng: this.selectedMap.lng};
  }

  getCurrentGenerationSeed(): number{
    const currentDate = new Date();
    return +`${currentDate.getUTCFullYear()}${currentDate.getUTCMonth()}${currentDate.getUTCDate()}${currentDate.getUTCHours()}${Math.floor(currentDate.getUTCMinutes()/this.generationTime)}${this.selectedMap.value}`
  }

  getTimeLeftToNextGeneraton(){
    const currentDate = new Date();
    return {minutes: this.generationTime-1 - Math.floor(currentDate.getUTCMinutes()%this.generationTime), seconds: 60 - currentDate.getUTCSeconds()};
  }
}
