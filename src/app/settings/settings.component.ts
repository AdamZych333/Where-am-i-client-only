import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { RegionService } from '../service/region.service';
import { Region } from '../utils/region';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent{
  seedLength = 15;
  timerValue: number = 180;
  selectedRegion: Region;
  noZoom: boolean = false;
  noMoving: boolean = false;
  noRotation: boolean = false;

  constructor(private regionService: RegionService, private router: Router) {
    this.selectedRegion = regionService.getRegions()[0];
  }

  getRegions(){
    return this.regionService.getRegions();
  }

  onCreateClick(){
    this.router.navigate(['/game'], {
      queryParams: {
        s: this.generateSeed(this.seedLength),
        t: this.timerValue,
        b: this.selectedRegion.value,
        z: this.noZoom,
        m: this.noMoving,
        r: this.noRotation,
      }
    });
  }

  onRotationChange(event: any){
    if(event.checked){
      this.noMoving = true;
    }
  }

  changeTime(newValue: number){
    this.timerValue = newValue;
  }

  generateSeed(length: number){
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
