import { Injectable } from '@angular/core';
import { Map } from '../utils/map';
import { Region, regions } from '../utils/region';
import { MapLoaderService } from './map-loader.service';
import { RandomStreetviewService } from './random-streetview.service';

@Injectable()
export class GameService {
  params: {
    seed: string,
    region: Region,
    timer: number,
  }
  panorama: any;
  map: any;
  currentGuess: any = null;
  drawings: any[] = [];
  maps: Map[] = [];
  currentMap: Map = this.maps[0];

  constructor(private randomStreetView: RandomStreetviewService, private mapLoader: MapLoaderService ) {
    this.params = {
      seed: '',
      region: regions[0],
      timer: 180,
    }
   }

   setParameters(seed: string, region = this.params.region, timer = this.params.timer){
    this.params.seed = seed;
    this.params.region = region;
    this.params.timer = timer;
   }

   async generateMap(){
    this.randomStreetView.setParameters({
      border: this.params.region.border,
      seed: this.params.seed,
      google: await this.mapLoader.load()
    })
    const location = await this.randomStreetView.getRandomLocation();
    const index = (this.maps.length+1).toString()
    this.currentMap = new Map(index, index, location[0], location[1]);
    this.maps.push(this.currentMap);
   }

   async setStreetView(panoramaElement: any){
    await this.mapLoader.load();
    this.panorama = new this.mapLoader.google.maps.StreetViewPanorama(panoramaElement.nativeElement, {
      position: new this.mapLoader.google.maps.LatLng(this.currentMap.answer),
      zoom: 1,
      pov: { heading: 0, pitch: 0 },
      showRoadLabels: false,
    })
  }

  resetPanoramaPosition(){
    this.panorama.setPosition(this.currentMap.answer);
  }

  async setMap(mapElement: any){
    await this.mapLoader.load();
    this.map = new this.mapLoader.google.maps.Map(mapElement.nativeElement, {
      center: new this.mapLoader.google.maps.LatLng(0, 0),
      zoom: 2,
      clickableIcons: false
    })

    this.map.addListener("click", (e:any) => {
      if(this.currentMap.score != null) return;
      if(this.currentGuess != null) {
        this.currentGuess.setMap(null);
        this.currentGuess = null;
      }
      const latLng = {lat: e.latLng.lat(), lng: e.latLng.lng()};
      this.currentGuess = new this.mapLoader.google.maps.Marker({
        position: latLng,
        map: this.map,
        label: {text: "?", color: "white"}
      })
    })
  }

  
  addMarkers(){
    if(this.currentMap.guess == null && this.currentMap.score == null) return;
    const to = new this.mapLoader.google.maps.Marker({
      position: this.currentMap.answer,
      map: this.map,
      label: {text: "!", color: 'yellow'}
    })
    this.drawings.push(to);
    this.setCenter(this.currentMap.answer);
    if(this.currentMap.guess != null){
      const from = new this.mapLoader.google.maps.Marker({
        position: this.currentMap.guess,
        map: this.map,
        label: {text: "?", color: 'white'}
      })
      const polyline = new this.mapLoader.google.maps.Polyline({
        strokeColor: "#ffcc66",
        strokeOpacity: .5,
        strokeWeight: 2,
        map: this.map,
        path: [from.getPosition(), to.getPosition()]
      })
      this.drawings.push(from)
      this.drawings.push(polyline)
    }
  }

  setCenter(latLng: {lat: number | null, lng: number | null}){
     this.map.setCenter(new this.mapLoader.google.maps.LatLng(latLng));
  }

  // reset(){
  //   if(this.guess != null){
  //     this.guess.setMap(null);
  //     this.guess = null;
  //   }
  //   while(this.drawings.length > 0){
  //     let drawing = this.drawings.pop();
  //     drawing.setMap(null)
  //     drawing = null;
  //   }
  //   this.map.setCenter(new this.loadMaps.google.maps.LatLng(this.defaultLatLng.lat, this.defaultLatLng.lng));
  //   this.map.setZoom(this.defaultZoom);
  // }

  setScore(guess: {lat: number, lng: number} | null){
    if(guess == null){
      this.currentMap.score = 0;
      return;
    }
    
    const distance = this.calculateScore(guess.lat, guess.lng, this.currentMap.answer.lat, this.currentMap.answer.lng);
    // 1pkt per 6km in a distance of 12000km
    const baseScore = Math.max(2000 - Math.round(distance/5500), 0);
    // 1pkt per 3km in a distance of 4500km
    const bonus1 = Math.max(1500 - Math.round(distance/3000), 0);
    // 1pkt per 800m in a distance of 800km
    const bonus2 = Math.max(1000 - Math.round(distance/800), 0);
    // 1pkt per 200m in a distance of 68km
    const bonus3 = Math.max(340 - Math.round(distance/200), 0);
    // 1pkt per 5m in a distance of 1200m
    const bonus4 = Math.max(120 - Math.round(distance/10), 0);
    // 1pkt per 1m in a distance of 40m
    const bonus5 = Math.max(40 - Math.round(distance), 0);
    this.currentMap.score = baseScore + bonus1 + bonus2 + bonus3 + bonus4 + bonus5;
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
