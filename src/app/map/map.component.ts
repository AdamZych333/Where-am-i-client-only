import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMapService } from '../service/google-map.service';
import { MapLoaderService, Settings } from '../service/map-loader.service';
import { StreetViewService } from '../service/street-view.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent {
  @ViewChild('panorama') gpanoramaElement: HTMLElement | null = null;
  @ViewChild('map') gmapElement: HTMLElement | null = null;

  scoreBoardExpanded: boolean = true;

  constructor(private googleMaps: GoogleMapService, private streetView: StreetViewService) {
  }

  ngAfterViewInit(): void {
    if(this.gpanoramaElement != null) this.streetView.setStreetView(this.gpanoramaElement);
    if(this.gpanoramaElement != null) this.googleMaps.setMap(this.gmapElement);
  }

  onResetClick(){
    this.streetView.resetPosition()
  }

  onScoreBoardClick(){
    this.scoreBoardExpanded = !this.scoreBoardExpanded;
  }
}
