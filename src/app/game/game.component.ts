import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../service/game.service';
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
  noZoom: boolean;
  noMoving: boolean;
  noRotation: boolean;

  constructor(private gameService: GameService, private route: ActivatedRoute, private router: Router) {
    this.region = gameService.params.region;
    this.timer = gameService.params.timer;
    this.noMoving = gameService.params.noMoving;
    this.noRotation = gameService.params.noRotation;
    this.noZoom = gameService.params.noZoom;
   }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if(params['s'] === undefined || params['s'].length === 0) {
          this.router.navigate(['']);
          return;
        }
        this.gameSeed = params['s'];
        const r = regions.find(e => e.value === params['b']);
        if(r !== undefined){
          this.region = r;
        }
        if(params['t'] !== undefined){
          this.timer = params['t'];
        }
        if(params['z'] !== undefined){
          this.noZoom = params['z'] == 'true';
        }
        if(params['m'] !== undefined){
          this.noMoving = params['m'] == 'true';
        }
        if(params['r'] !== undefined){
          this.noRotation = params['r'] == 'true';
        }
      }
    )

    this.gameService.setParameters(this.gameSeed, this.region, this.timer, this.noZoom, this.noMoving, this.noRotation);
  }

  getShowMap(){
    return this.gameSeed != '';
  }
}
