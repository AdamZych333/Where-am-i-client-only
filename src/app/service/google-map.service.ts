import { Injectable } from '@angular/core';
import { MapLoaderService } from './map-loader.service';
import { MapService } from './map.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {
  defaultZoom = 2;
  defaultLatLng = {lat: 0, lng: 0};
  map: any;
  guess: any;
  drawings: any[] = [];

  constructor(private settings: SettingsService, private loadMaps: MapLoaderService) { }

  async setMap(mapElement: any){
    await this.loadMaps.load();
    this.map = new this.loadMaps.google.maps.Map(mapElement.nativeElement, {
      center: new this.loadMaps.google.maps.LatLng(this.defaultLatLng.lat, this.defaultLatLng.lng),
      zoom: this.defaultZoom,
      clickableIcons: false
    })

    this.map.addListener("click", (e:any) => {
      if(this.settings.selectedMap.score != null) return;
      if(this.guess != undefined) {
        this.guess.setMap(null);
        this.guess = null;
      }
      const latLng = {lat: e.latLng.lat(), lng: e.latLng.lng()};
      this.guess = new this.loadMaps.google.maps.Marker({
        position: latLng,
        map: this.map,
        label: {text: "?", color: "white"}
      })
    })
  }

  addMarkers(){
    const answerLatLng = {lat: this.settings.selectedMap.lat, lng: this.settings.selectedMap.lng}
    const to = new this.loadMaps.google.maps.Marker({
      position: answerLatLng,
      map: this.map,
      label: {text: "!", color: 'yellow'}
    })
    this.drawings.push(to)
    if(this.settings.selectedMap.guess != null){
      const from = new this.loadMaps.google.maps.Marker({
        position: this.settings.selectedMap.guess,
        map: this.map,
        label: {text: "?", color: 'white'}
      })
      const polyline = new this.loadMaps.google.maps.Polyline({
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
    this.map.setCenter(new this.loadMaps.google.maps.LatLng(latLng));
  }

  reset(){
    if(this.guess != null){
      this.guess.setMap(null);
      this.guess = null;
    }
    while(this.drawings.length > 0){
      let drawing = this.drawings.pop();
      drawing.setMap(null)
      drawing = null;
    }
    this.map.setCenter(new this.loadMaps.google.maps.LatLng(this.defaultLatLng.lat, this.defaultLatLng.lng));
    this.map.setZoom(this.defaultZoom);
    this.addMarkers();
  }
}
