import { Injectable } from '@angular/core';
import { MapLoaderService } from './map-loader.service';

@Injectable({
  providedIn: 'root'
})
export class StreetViewService {
  panorama: any;

  constructor(private mapLoader: MapLoaderService) { }

  async setStreetView(panoramaElement: any, answer: {lat: number, lng: number}){
    await this.mapLoader.load();
    this.panorama = new this.mapLoader.google.maps.StreetViewPanorama(panoramaElement.nativeElement, {
      position: new this.mapLoader.google.maps.LatLng(answer),
      zoom: 1,
      pov: { heading: 0, pitch: 0 },
      showRoadLabels: false,
    })
  }

  setPanoramaPosition(position: {lat: number, lng: number}){
    this.panorama.setPosition(position);
  }
}
