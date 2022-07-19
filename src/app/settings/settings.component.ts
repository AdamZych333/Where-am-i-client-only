import { Component} from '@angular/core';
import { GoogleMapService } from '../service/google-map.service';
import { MapService } from '../service/map.service';
import { SettingsService } from '../service/settings.service';
import { Region, regions } from '../utils/region';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent{
  timerValue: number = 180;
  selectedRegion: Region;

  constructor() {
    this.selectedRegion = regions[0];
  }

  getRegions(){
    return regions;
  }

  onCreateClick(){

  }
}
