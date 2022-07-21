import { Injectable } from '@angular/core';
import { Map } from '../utils/map';
import { Region } from '../utils/region';
import { GoogleMapService } from './google-map.service';
import { MapLoaderService } from './map-loader.service';
import { RandomStreetviewService } from './random-streetview.service';
import { RegionService } from './region.service';
import { StreetViewService } from './street-view.service';

@Injectable()
export class GameService {
  params: {
    seed: string,
    region: Region,
    timer: number,
    noZoom: boolean,
    noMoving: boolean,
    noRotation: boolean,
  }
  maps: Map[] = [];
  currentMap: Map = this.maps[0];

  constructor(regionService: RegionService,private googleMaps: GoogleMapService, private streetView: StreetViewService, private randomStreetView: RandomStreetviewService, private mapLoader: MapLoaderService ) {
    this.params = {
      seed: '',
      region: regionService.getRegions()[0],
      timer: 180,
      noZoom: false,
      noMoving: false,
      noRotation: false,
    }
   }

   isMapFinnished(map: Map){
    return map != undefined && map.score != null;
   }

   getFinnishedMaps(){
    return this.maps.filter(e => this.isMapFinnished(e));
   }

   resetSVPosition(){
    this.streetView.setPanoramaPosition(this.currentMap.answer);
   }

   setToPreviousMap(){
    const currIndex = this.maps.indexOf(this.currentMap);
    if(currIndex === 0) return;
    this.currentMap = this.maps[currIndex-1];
    this.streetView.setPanoramaPosition(this.currentMap.answer);
    this.googleMaps.removeDrawings();
   }

   async setToNextMap(){
    const currIndex = this.maps.indexOf(this.currentMap);
    if(currIndex === this.maps.length-1) await this.generateMap();
    else this.currentMap = this.maps[currIndex+1];
    this.streetView.setPanoramaPosition(this.currentMap.answer);
    this.googleMaps.removeDrawings();
   }

   setParameters(seed: string, region = this.params.region, timer = this.params.timer, noZoom = this.params.noZoom, noMoving = this.params.noMoving, noRotation = this.params.noRotation){
    this.params.seed = seed;
    this.params.region = region;
    this.params.timer = timer;
    this.params.noZoom = noZoom;
    this.params.noMoving = noMoving;
    this.params.noRotation = noRotation;
   }

  async generateMap(){
    this.randomStreetView.setParameters({
      border: this.params.region.border,
      seed: this.params.seed + this.maps.indexOf(this.currentMap),
      google: await this.mapLoader.load()
    })
    const location = await this.randomStreetView.getRandomLocation();
    const index = (this.maps.length+1).toString()
    this.currentMap = new Map(index, index, location[0], location[1]);
    this.maps.push(this.currentMap);
  }

  setScore(guess: {lat: number, lng: number} | null){
    if(guess == null){
      this.currentMap.score = 0;
      return;
    }
    
    const distance = this.calculateScore(guess.lat, guess.lng, this.currentMap.answer.lat, this.currentMap.answer.lng);
    // 1pkt per 11km in a distance of 11000km
    const baseScore = Math.max(1000 - Math.round(distance/11000), 0);
    
    const bonuses = [
      // 1pkt per 2.5km in a distance of 5000km
      Math.max(2000- Math.round(distance/2500), 0),
      // 1pkt per 1km in a distance of 2000km
      Math.max(1000 - Math.round(distance/2000), 0),
      // 1pkt per 1km in a distance of 700km
      Math.max(700 - Math.round(distance/1000), 0),
      // 1pkt per 1km in a distance of 160km
      Math.max(180 - Math.round(distance/800), 0),
      // 1pkt per 1km in a distance of 7km
      Math.max(80 - Math.round(distance/100), 0),
      // 1pkt per 10m in a distance of 300m
      Math.max(30 - Math.round(distance/10), 0),
      // 1pkt per 1m in a distance of 10m
      Math.max(10 - Math.round(distance), 0),
    ]
    this.currentMap.score = baseScore + bonuses.reduce((a, b) => a + b, 0);
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

    return R * c // meters
  }
}
