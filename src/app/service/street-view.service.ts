import { Injectable } from '@angular/core';
import { MapLoaderService } from './map-loader.service';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class StreetViewService {
  panorama: any;

  constructor(private loadMaps: MapLoaderService, private mapService: MapService) { }

  async setStreetView(panoramaElement: any){
    await this.loadMaps.load();
    const latLng = await this.mapService.getCoordinates();
    this.panorama = new this.loadMaps.google.maps.StreetViewPanorama(panoramaElement.nativeElement, {
      position: new this.loadMaps.google.maps.LatLng(latLng.lat, latLng.lng),
      zoom: 1,
      pov: { heading: 0, pitch: 0 },
      showRoadLabels: false,
    })
  }

  async updateStreetView(){
    const latLng = await this.mapService.getCoordinates();
    this.panorama.setPosition(latLng);
  }

  resetPosition(){
    const latLng = {lat: this.mapService.selectedMap.lat, lng: this.mapService.selectedMap.lng};
    this.panorama.setPosition(latLng);
  }
}
