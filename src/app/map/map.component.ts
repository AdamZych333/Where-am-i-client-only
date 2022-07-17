import { Component, HostBinding, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleMapService } from '../service/google-map.service';
import { MapService } from '../service/map.service';
import { ScoreService } from '../service/score.service';
import { StreetViewService } from '../service/street-view.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent {
  //@ViewChild('panorama') gpanoramaElement: HTMLElement | null = null;
  //@ViewChild('map') gmapElement: HTMLElement | null = null;

  scoreBoardExpanded: boolean = false;

  @HostBinding("attr.style")
  public get panoramaWidth(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`--panorama-width: ${this.getStreetViewStyle().width}`);
  }

  constructor(private sanitizer: DomSanitizer ,public mapService: MapService,private scoreService: ScoreService, private googleMaps: GoogleMapService, private streetView: StreetViewService) {
  }

  getStreetViewStyle(){
    return {
      'width': '92vw', 
      'height': '95vh',
    }
  }

  getMapStyle(){
    return {
      'width': 'calc(46vw - 30px)',
      'height': '400px'
    }
  }

  onResetClick(){
    this.streetView.resetPosition()
  }

  onScoreBoardClick(){
    this.scoreBoardExpanded = !this.scoreBoardExpanded;
  }

  onSubmitClick(){
    const marker = this.googleMaps.guess;
    if(marker == undefined || this.mapService.selectedMap.score != null) return;
    const guess = {lat: marker.position.lat(), lng: marker.position.lng()};
    this.mapService.selectedMap.guess = guess;
    this.scoreService.setScore(guess);
    this.googleMaps.addMarkers();
  }
}
