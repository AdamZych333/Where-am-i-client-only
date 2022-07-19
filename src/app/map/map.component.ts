import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GameService } from '../service/game.service';
import { GoogleMapService } from '../service/google-map.service';
import { MapService } from '../service/map.service';
import { SettingsService } from '../service/settings.service';
import { Region, regions } from '../utils/region';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit {
  timeLeft: number;
  timer: any;

  @HostBinding("attr.style")
  public get panoramaWidth(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`--panorama-width: ${this.getStreetViewStyle().width}`);
  }

  constructor(private game: GameService, public mapsService: MapService, public settings: SettingsService, private sanitizer: DomSanitizer, private googleMaps: GoogleMapService) {
    this.timeLeft = game.params.timer;
  }
  ngOnInit(): void {
    this.startTimer();
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

  getTimerValue(){
    return {minutes: Math.floor(this.timeLeft/60), seconds: this.timeLeft%60};
  }

  startTimer(){
    if(this.timeLeft === 0) return;
    this.timer = setTimeout(() => {
      this.timeLeft--;
      this.startTimer();
    }, 1000);
  }

  stopTimer(){
    if(this.timer != undefined)
      clearTimeout(this.timer);
  }

  resetTimer(){
    this.stopTimer()
    this.timeLeft = this.game.params.timer;
  }

  onResetClick(){
    this.game.resetPanoramaPosition();
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
