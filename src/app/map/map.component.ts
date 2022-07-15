import { Component, ElementRef, ViewChild } from '@angular/core';
import { MapLoaderService, Settings } from '../service/map-loader.service';
import { StreetViewService } from '../service/street-view.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent {
  @ViewChild('map') gmapElement: HTMLElement | null = null;

  constructor(private streetView: StreetViewService) {
  }

  ngAfterViewInit(): void {
    if(this.gmapElement != null) this.streetView.setStreetView(this.gmapElement);
  }


}
