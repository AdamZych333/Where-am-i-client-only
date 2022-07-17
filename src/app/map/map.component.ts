import { Component, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleMapService } from '../service/google-map.service';
import { MapService } from '../service/map.service';
import { SettingsService } from '../service/settings.service';
import { StreetViewService } from '../service/street-view.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent {

  @HostBinding("attr.style")
  public get panoramaWidth(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`--panorama-width: ${this.getStreetViewStyle().width}`);
  }

  constructor(public mapsService: MapService, public settings: SettingsService, private sanitizer: DomSanitizer, private googleMaps: GoogleMapService, private streetView: StreetViewService) {
  }

  getStreetViewStyle(){
    return {
      'width': '92vw', 
      'height': this.settings.started?'95vh':'0px',
    }
  }

  getMapStyle(){
    return {
      'width': 'calc(46vw - 30px)',
      'height': '400px'
    }
  }

  onResetClick(){
    if(this.settings.selectedMap.lat == null || this.settings.selectedMap.lng == null) return;
    this.streetView.updateStreetViewPosition({lat: this.settings.selectedMap.lat, lng: this.settings.selectedMap.lng})
  }

  onScoreBoardClick(){
    this.mapsService.scoreBoardExpanded = !this.mapsService.scoreBoardExpanded;
  }

  onSubmitClick(){
    const marker = this.googleMaps.guess;
    if(marker == undefined || this.settings.selectedMap.score != null) return;
    const guess = {lat: marker.position.lat(), lng: marker.position.lng()};
    this.settings.selectedMap.guess = guess;
    this.mapsService.setScore(guess, this.settings.selectedMap);
    this.googleMaps.addMarkers();
  }

  displayComponent(){
    return this.settings.started? 'visible': 'hidden'
  }
}
