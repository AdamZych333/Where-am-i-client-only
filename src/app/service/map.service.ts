import { Injectable } from '@angular/core';
import { MapLoaderService } from './map-loader.service';
import { RandomStreetviewService } from './random-streetview.service';
import { Map } from '../utils/map';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  scoreBoardExpanded: boolean = false;
  
  constructor(private settings: SettingsService, private mapLoader: MapLoaderService, private randomStreetView: RandomStreetviewService) {}

  async getCoordinates(map: Map){
    let seed = this.settings.getCurrentGenerationSeed(map);
    if(!map.hasSetCoordinates() || map.seed !== seed){
      console.log(`Loading coordinates for map: ${map.value}`)
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
        e.reset();
      }
    });
  }

  setScore(guess: {lat: number, lng: number} | null, map: Map){
    if(guess == null){
      this.settings.selectedMap.score = 0;
      return;
    }
    const answerLatLng = {lat: map.lat, lng: map.lng}
    if(answerLatLng.lat == null || answerLatLng.lng == null) return;
    this.settings.selectedMap.score = this.calculateScore(guess.lat, guess.lng, answerLatLng.lat, answerLatLng.lng);
  }

  private calculateScore(guessLat:number, guessLng:number, answerLat:number, answerLng:number){
    const R = 6371e3; // meters
    const fi1 = guessLat * Math.PI/180;
    const fi2 = answerLat * Math.PI/180;
    const deltaFi = (answerLat-guessLat) * Math.PI/180;
    const deltaLambda = (answerLng-guessLng) * Math.PI/180;

    const a = Math.sin(deltaFi/2) * Math.sin(deltaFi/2) +
        Math.cos(fi1) * Math.cos(fi2) *
        Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c // meters

    // 1pkt per 1km in a distance of 5000km
    const baseScore = Math.max(5000 - Math.round(distance/1000), 0);
    // 2pkt per 1km in a distance of 1000km
    const bonus1 = Math.max(2*(1000-Math.round(distance/1000)), 0);
    // 10pkt per 1km in a distance of 100km
    const bonus2 = Math.max(10*(100-Math.round(distance/1000)), 0);
    // 1pkt per 5m in a distance of 5km
    const bonus3 = Math.max((5000-Math.round(distance))/5, 0);
    // 10pkt per 1m in a distance of 100m
    const bonus4 = Math.max(10*(1000-Math.round(distance)), 0);
    return baseScore + bonus1 + bonus2 + bonus3 + bonus4;
  }
}
