import { Injectable } from '@angular/core';
import { MapLoaderService } from './map-loader.service';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {
  defaultZoom = 2;
  defaultLatLng = {lat: 0, lng: 0};
  map: any;
  marker: any;

  constructor(private mapService: MapService, private loadMaps: MapLoaderService) { }

  async setMap(mapElement: any){
    await this.loadMaps.load();
    this.map = new this.loadMaps.google.maps.Map(mapElement.nativeElement, {
      center: new this.loadMaps.google.maps.LatLng(this.defaultLatLng.lat, this.defaultLatLng.lng),
      zoom: this.defaultZoom,
    })

    this.map.addListener("click", (e:any) => {
      if(this.mapService.selectedMap.score != null) return;
      if(this.marker != undefined) {
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

  reset(){
    this.marker.setMap(null);
    this.marker = null;
    this.map.setCenter(new this.loadMaps.google.maps.LatLng(this.defaultLatLng.lat, this.defaultLatLng.lng));
    this.map.setZoom(this.defaultZoom);
  }
}
