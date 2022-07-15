import { Component, OnInit } from '@angular/core';
import { MapService } from '../service/map.service';
import { RegionService } from '../service/region.service';
import { StreetViewService } from '../service/street-view.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit{
  timeLeft: {minutes: number, seconds: number};

  constructor(private streetView: StreetViewService, public mapService: MapService, public regionService: RegionService) {
    this.timeLeft = mapService.getTimeLeftToNextGeneraton();
  }

  ngOnInit(): void {
    this.updateTimeLeft()
  }

  updateTimeLeft(){
    setTimeout(() => {
      this.timeLeft = this.mapService.getTimeLeftToNextGeneraton();
      this.updateTimeLeft();
    }, 1000);
  }

  onSettingsChange(){
    this.streetView.updateStreetView();
  }
}
