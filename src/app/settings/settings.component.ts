import { Component} from '@angular/core';
import { GoogleMapService } from '../service/google-map.service';
import { MapService } from '../service/map.service';
import { SettingsService } from '../service/settings.service';
import { StreetViewService } from '../service/street-view.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent{
  pickedTime: {minutes: number, seconds: number};

  constructor(public settings: SettingsService, private googleMaps: GoogleMapService,private streetView: StreetViewService, private mapService: MapService) {
    this.pickedTime = settings.timerValue;
  }

  async onRegionChange(){
  }

  onCreateClick(){

  }
}
