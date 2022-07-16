import { Injectable } from '@angular/core';
import { mulberry32 } from '../utils/randomNumberWithSeed';
import { MapLoaderService } from './map-loader.service';
import { RandomStreetviewService } from './random-streetview.service';
import { StreetViewService } from './street-view.service';

export class Map{
  lat: number | null = null;
  lng: number | null = null;
  constructor(public value: string, public viewValue: string){}

  setCoordinates(lat: number, lng: number){
    this.lat = lat;
    this.lng = lng;
  }

  hasSetCoordinates(){
    return this.lat !== null && this.lng !== null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  generationTime = 10;
  numberOfMaps = 20;
  maps: Map[] = <Map[]>[];
  selectedMap: Map;
  regions = [
    {value: 'world', viewValue: 'The World', border: [[[36.050655, 35.047808], [33.588766, 34.364699], [35.235311, 30.703665]]]},
  ]
  selectedRegion = this.regions[0];

  constructor(private mapLoader: MapLoaderService, private randomStreetView: RandomStreetviewService) {
    for(let i = 0; i < this.numberOfMaps; i++){
      this.maps.push(new Map((i+1).toString(), (i+1).toString()));
    }
    this.selectedMap = this.maps[0];
  }

  async getCoordinates(){
    // regionservice.selectedregion.border => generate maps with seed
    if(!this.selectedMap.hasSetCoordinates()){
      this.randomStreetView.setParameters({
        border: this.selectedRegion.border,
        seed: this.getCurrentGenerationSeed(),
        google: await this.mapLoader.load()
      })
      const location = await this.randomStreetView.getRandomLocation();
      this.selectedMap.setCoordinates(location[0], location[1]);
    }
    return {lat: this.selectedMap.lat, lng: this.selectedMap.lng};
  }

  getCurrentGenerationSeed(): number{
    const currentDate = new Date();
    return +`${currentDate.getUTCFullYear()}${currentDate.getUTCMonth()}${currentDate.getUTCDate()}${currentDate.getUTCHours()}${Math.floor(currentDate.getUTCMinutes()/10)}${this.selectedMap.value}`
  }

  getTimeLeftToNextGeneraton(){
    const currentDate = new Date();
    return {minutes: this.generationTime-1 - Math.floor(currentDate.getUTCMinutes()%this.generationTime), seconds: 60 - currentDate.getUTCSeconds()};
  }
}
