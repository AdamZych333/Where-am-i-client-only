import { Injectable } from '@angular/core';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private mapService: MapService) { }

  setScore(marker: {lat: number, lng: number}){
    const answerLatLng = {lat: this.mapService.selectedMap.lat, lng: this.mapService.selectedMap.lng}
    if(answerLatLng.lat == null || answerLatLng.lng == null) return;
    this.mapService.selectedMap.score = this.calculateScore(marker.lat, marker.lng, answerLatLng.lat, answerLatLng.lng);
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
