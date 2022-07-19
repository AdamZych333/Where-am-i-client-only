import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../service/settings.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {
  gameSeed: string = '';
  region: string;
  timer: number;

  constructor(settings: SettingsService, private route: ActivatedRoute, private router: Router) {
    this.region = settings.regions[0].value;
    this.timer = settings.timerValue;
   }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if(params['s'] === undefined) {
          this.router.navigate(['']);
          return;
        }
        this.gameSeed = params['s'];
        if(params['r'] !== undefined){
          this.region = params['r'];
        }
        if(params['t'] !== undefined){
          this.timer = params['t'];
        }
      })
  }

}
