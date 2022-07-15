import { Injectable } from '@angular/core';
import { MapLoaderService } from './map-loader.service';

@Injectable({
  providedIn: 'root'
})
export class StreetViewService {
  settings = {
    lat: 37.86926,
    lng: -122.254811,
  }
  panorama: any;

  constructor(private loadMaps: MapLoaderService) { }

  async setStreetView(panoramaElement: any){
    await this.loadMaps.load();
    this.panorama = new this.loadMaps.google.maps.StreetViewPanorama(panoramaElement.nativeElement, {
      position: new this.loadMaps.google.maps.LatLng(this.settings.lat, this.settings.lng),
      zoom: 1,
      pov: { heading: 0, pitch: 0 },
      showRoadLabels: false,
    })
    console.log(this.panorama)
  }

  async updateStreetView(){

  }
}
