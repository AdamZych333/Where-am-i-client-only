import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit{
  timeLeft: {minutes: number, seconds: number};

  constructor(private mapService: MapService) {
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
}
