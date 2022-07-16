import { Injectable } from '@angular/core';
import { MapLoaderService } from './map-loader.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {
  map: any;
  marker: any;

  constructor(private loadMaps: MapLoaderService) { }

  async setMap(mapElement: any){
    await this.loadMaps.load();
    this.map = new this.loadMaps.google.maps.Map(mapElement.nativeElement, {
      center: new this.loadMaps.google.maps.LatLng(0, 0),
      zoom: 2,
    })

    this.map.addListener("click", (e:any) => {
      if(this.marker !== undefined) {
        this.marker.setMap(null);
        this.marker = null;
      }
      const latLng = {lat: e.latLng.lat(), lng: e.latLng.lng()};
      this.marker = new this.loadMaps.google.maps.Marker({
        position: latLng,
        map: this.map,
        label: {text: "?", color: "white"}
      })
    })
  }
}
