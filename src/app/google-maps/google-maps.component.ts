import { Component, Input, ViewChild } from '@angular/core';
import { GoogleMapService } from '../service/google-map.service';
import { MapLoaderService } from '../service/map-loader.service';
import { MapService } from '../service/map.service';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.sass']
})
export class GoogleMapsComponent {
  @ViewChild('container') containerElement: HTMLElement | null = null;
  @Input() style = {}

  constructor(private googleMapsService: GoogleMapService) { }

  ngAfterViewInit(): void {
    if(this.containerElement != null) this.googleMapsService.setMap(this.containerElement);
  }
}
