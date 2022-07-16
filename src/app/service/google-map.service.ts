import { Injectable } from '@angular/core';
import { MapLoaderService } from './map-loader.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {
  map: any;

  constructor(private loadMaps: MapLoaderService) { }

  async setMap(mapElement: any){
    await this.loadMaps.load();
    this.map = new this.loadMaps.google.maps.Map(mapElement.nativeElement, {
      center: new this.loadMaps.google.maps.LatLng(0, 0),
      zoom: 2,
    })
  }
}
