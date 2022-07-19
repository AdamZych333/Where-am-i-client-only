import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../service/game.service';
import { SettingsService } from '../service/settings.service';
import { Region, regions } from '../utils/region';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
  providers: [GameService]
})
export class GameComponent implements OnInit {
  gameSeed: string = '';
  region: Region;
  timer: number;

  constructor(gameService: GameService, private route: ActivatedRoute, private router: Router) {
    this.region = gameService.params.region;
    this.timer = gameService.params.timer;
   }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if(params['s'] === undefined) {
          this.router.navigate(['']);
          return;
        }
        this.gameSeed = params['s'];
        const r = regions.find(e => e.value === params['r']);
        if(params['r'] !== undefined && r !== undefined){
          this.region = r;
        }
        if(params['t'] !== undefined){
          this.timer = params['t'];
        }
      })
  }

  getShowMap(){
    return this.gameSeed != '';
  }
}
