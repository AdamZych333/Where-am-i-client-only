import { Component, ElementRef, ViewChild } from '@angular/core';
import { MapLoaderService, Settings } from '../service/map-loader.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent {
  @ViewChild('map') gmapElement: HTMLElement | null = null;
  streetViewSettings: Settings = {
    lat: 37.86926,
    lng: -122.254811,
    zoom: 1,
  }

  constructor(private mapLoader: MapLoaderService) {
  }

  ngAfterViewInit(): void {
    if(this.gmapElement != null)  console.log(this.mapLoader.initStreetView(this.gmapElement, this.streetViewSettings))
  }


}
