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


  constructor(public settings: SettingsService, private googleMaps: GoogleMapService,private streetView: StreetViewService, private mapService: MapService) {
    this.timeLeft = settings.getTimeLeftToNextGeneraton();
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
    this.settings.resetTimer();
    this.mapService.resetMaps();
    this.googleMaps.reset();
    const latLng = await this.mapService.getCoordinates(this.settings.selectedMap);
    if(latLng.lat == null || latLng.lng == null) return;
    this.streetView.updateStreetViewPosition({lat: latLng.lat, lng: latLng.lng});
  }

  onStartClick(){
    this.settings.started = true;
    this.settings.startTimer();
  }
}
