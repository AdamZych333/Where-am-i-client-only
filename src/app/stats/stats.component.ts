import { Component } from '@angular/core';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.sass']
})
export class StatsComponent {

  constructor(private game: GameService) {}

  getMapsPlayed(){
    return this.game.getFinnishedMaps().length;
  }

  getAvgScore(){
    const maps = this.game.getFinnishedMaps();
    if(maps == null || maps.length === 0) return 0;
    const sum = maps.map(e => e.score).reduce((a, b) => {
      if(a === null || b == null) return 0;
      return a + b;
    }, 0);
    if(sum === null) return 0;

    return Math.round(sum/maps.length);
  }

  getBestScore(){
    const maps = this.game.getFinnishedMaps();
    if(maps == null || maps.length === 0) return 0;
    return maps.map(e => e.score).reduce((a, b) => {
      if(a === null) return b;
      if(b === null) return a;
      if(a > b) return a;
      return b;
    }, 0);
    
  }
}
