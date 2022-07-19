import { Component, Input, ViewChild } from '@angular/core';
import { GameService } from '../service/game.service';
import { GoogleMapService } from '../service/google-map.service';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.sass']
})
export class GoogleMapsComponent {
  @ViewChild('container') containerElement: HTMLElement | null = null;
  @Input() style = {}

  constructor(private game: GameService, private googleMap: GoogleMapService) { }

  ngAfterViewInit(): void {
    if(this.containerElement != null) this.googleMap.setMap(this.containerElement);
  }
}
