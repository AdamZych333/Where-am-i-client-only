import { Injectable } from '@angular/core';
import { Map } from '../utils/map';
import { MapLoaderService } from './map-loader.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {
  map: any;
  currentGuess: any = null;
  drawings: any[] = [];

  constructor(private mapLoader: MapLoaderService) { }

  async setMap(mapElement: any){
    await this.mapLoader.load();
    this.map = new this.mapLoader.google.maps.Map(mapElement.nativeElement, {
      center: new this.mapLoader.google.maps.LatLng(0, 0),
      zoom: 2,
      clickableIcons: false
    })

    this.map.addListener("click", (e:any) => {
      if(this.drawings.length > 0) return;
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

  addMarkers(map: Map){
    if(map.guess == null && map.score == null) return;
    const to = new this.mapLoader.google.maps.Marker({
      position: map.answer,
      map: this.map,
      label: {text: "!", color: 'yellow'}
    })
    this.drawings.push(to);
    this.setCenter(map.answer);
    if(map.guess != null){
      const from = new this.mapLoader.google.maps.Marker({
        position: map.guess,
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

  reset(){
    this.removeDrawings();
    if(this.map != undefined){
      this.map.setCenter(new this.mapLoader.google.maps.LatLng(0, 0));
      this.map.setZoom(2);
    }
  }

  removeDrawings(){
    while(this.drawings.length > 0){
      let drawing = this.drawings.pop();
      drawing.setMap(null);
      drawing = null;
    }
    if(this.currentGuess != undefined){
      this.currentGuess.setMap(null);
      this.currentGuess = null;
    }
  }

  setCenter(latLng: {lat: number | null, lng: number | null}){
     this.map.setCenter(new this.mapLoader.google.maps.LatLng(latLng));
  }
}
