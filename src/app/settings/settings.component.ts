import { Component, OnInit } from '@angular/core';
import { GoogleMapService } from '../service/google-map.service';
import { MapService } from '../service/map.service';
import { SettingsService } from '../service/settings.service';
import { StreetViewService } from '../service/street-view.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit{
  timeLeft: {minutes: number, seconds: number};
  pickedTime: {minutes: number, seconds: number};

  constructor(public settings: SettingsService, private googleMaps: GoogleMapService,private streetView: StreetViewService, private mapService: MapService) {
    this.timeLeft = settings.getTimeLeftToNextGeneraton();
    this.pickedTime = settings.timerValue;
  }

  ngOnInit(): void {
    this.updateTimeLeft()
  }

  updateTimeLeft(){
    setTimeout(() => {
      this.timeLeft = this.settings.getTimeLeftToNextGeneraton();
      this.updateTimeLeft();
    }, 1000);
  }

  async onSettingsChange(){
    this.settings.started = false;
    this.resetTimer();
    this.mapService.resetMaps();
    this.mapService.scoreBoardExpanded = false;
    this.googleMaps.reset();
    const latLng = await this.mapService.getCoordinates(this.settings.selectedMap);
    if(latLng.lat == null || latLng.lng == null) return;
    this.streetView.updateStreetViewPosition({lat: latLng.lat, lng: latLng.lng});
    if(this.settings.selectedMap.guess != null && this.settings.selectedMap.score != null){
      this.settings.started = true;
      this.mapService.scoreBoardExpanded = true;
      this.startTimer();
    }
  }

  onStartClick(){
    this.settings.started = true;
    this.settings.timerValue = this.pickedTime;
    this.startTimer();
  }

  private timerToSeconds(){
    return this.settings.timerValue.minutes*60 + this.settings.timerValue.seconds;
  }

  private secondsToTimer(seconds: number){
    return {minutes: Math.floor(seconds/60), seconds: seconds%60};
  }

  startTimer(){
    if(this.settings.selectedMap.score != null){
      this.settings.timerValue = this.secondsToTimer(0);
      return;
    }
    this.settings.timer = setTimeout(() => {
      this.settings.timerValue = this.secondsToTimer(this.timerToSeconds()-1);
      if(this.settings.timerValue.minutes == 0 && this.settings.timerValue.seconds == 0){
        this.stopTimer();
        const marker = this.googleMaps.guess;
        let guess;
        if(marker == undefined) guess = null
        else  guess = {lat: marker.position.lat(), lng: marker.position.lng()};
        this.settings.selectedMap.guess = guess;
        this.mapService.setScore(guess, this.settings.selectedMap);
        this.mapService.scoreBoardExpanded = true;
        this.googleMaps.addMarkers();
        this.googleMaps.setCenter({lat: this.settings.selectedMap.lat, lng: this.settings.selectedMap.lng});
      }
      else this.startTimer();
    }, 1000);
  }

  stopTimer(){
    if(this.settings.timer != null)
      clearTimeout(this.settings.timer);
  }

  resetTimer(){
    this.stopTimer()
    this.settings.timerValue = this.pickedTime;
  }
}
