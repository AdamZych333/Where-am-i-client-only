import { Injectable } from '@angular/core';
import { MapLoaderService } from './map-loader.service';
import { RandomStreetviewService } from './random-streetview.service';
import { Map } from '../utils/map';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private settings: SettingsService, private mapLoader: MapLoaderService, private randomStreetView: RandomStreetviewService) {
    for(let i = 0; i < settings.numberOfMaps; i++){
      settings.maps.push(new Map((i+1).toString(), (i+1).toString()));
    }
    settings.selectedMap = settings.maps[0];
  }

  async getCoordinates(map: Map){
    let seed = this.settings.getCurrentGenerationSeed(map);
    if(!map.hasSetCoordinates() || map.seed !== seed){
      map.seed = seed;
      this.randomStreetView.setParameters({
        border: this.settings.selectedRegion.border,
        seed: seed,
        google: await this.mapLoader.load()
      })
      const location = await this.randomStreetView.getRandomLocation();
      map.setCoordinates(location[0], location[1]);
    }
    return {lat: map.lat, lng: map.lng};
  }

  resetMaps(){
    this.settings.maps.forEach(e => {
      if(e.seed != this.settings.getCurrentGenerationSeed(e)) {
        e.score = null;
        e.guess = null;
      }
    });
  }

  setScore(marker: {lat: number, lng: number}, map: Map){
    const answerLatLng = {lat: map.lat, lng: map.lng}
    if(answerLatLng.lat == null || answerLatLng.lng == null) return;
    this.settings.selectedMap.score = this.calculateScore(marker.lat, marker.lng, answerLatLng.lat, answerLatLng.lng);
  }

  private calculateScore(guessLat:number, guessLng:number, answerLat:number, answerLng:number){
    const R = 6371;
    const fi1 = guessLat * Math.PI/180;
    const fi2 = answerLat * Math.PI/180;
    const deltaFi = (answerLat-guessLat) * Math.PI/180;
    const deltaLambda = (answerLng-guessLng) * Math.PI/180;

    const a = Math.sin(deltaFi/2) * Math.sin(deltaFi/2) +
        Math.cos(fi1) * Math.cos(fi2) *
        Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const score = 10000 - Math.round(R * c);
    return Math.max(score, 0);
  }
}
