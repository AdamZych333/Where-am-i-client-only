import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { Region, regions } from '../utils/region';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent{
  seedLength = 15;
  timerValue: number = 180;
  selectedRegion: Region;

  constructor(private router: Router) {
    this.selectedRegion = regions[0];
  }

  getRegions(){
    return regions;
  }

  onCreateClick(){
    this.router.navigate(['/game'], {
      queryParams: {
        s: this.generateSeed(this.seedLength)
      }
    });
  }

  generateSeed(length: number){
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    console.log(result)
    return result;
  }
}
