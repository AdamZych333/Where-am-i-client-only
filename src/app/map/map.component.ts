import { Component, HostBinding, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit {
  timeLeft: number;
  timer: any;
  scoreBoardExpanded = false;

  @HostBinding("attr.style")
  public get panoramaWidth(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`--panorama-width: ${this.getStreetViewStyle().width}`);
  }

  constructor(private game: GameService, private sanitizer: DomSanitizer) {
    this.timeLeft = game.params.timer;
  }
  ngOnInit(): void {
    if(this.timeLeft == 0) return;
    this.startTimer();
  }

  getStreetViewStyle(){
    return {
      'width': '92vw', 
      'height': '95vh',
    }
  }

  getMapStyle(){
    return {
      'width': 'calc(46vw - 30px)',
      'height': '400px'
    }
  }

  getTimerValue(){
    return {minutes: Math.floor(this.timeLeft/60), seconds: this.timeLeft%60};
  }

  startTimer(){
    if(this.timeLeft <= 0) {
      this.onTimeEnd();
      return;
    }
    this.timer = setTimeout(() => {
      this.timeLeft--;
      this.startTimer();
    }, 1000);
  }

  stopTimer(){
    if(this.timer != undefined)
      clearTimeout(this.timer);
  }

  resetTimer(){
    this.stopTimer()
    this.timeLeft = this.game.params.timer;
  }

  onResetClick(){
    this.game.resetPanoramaPosition();
  }

  onScoreBoardClick(){
    this.scoreBoardExpanded = !this.scoreBoardExpanded;
  }

  onSubmitClick(){
    if(this.game.currentGuess == undefined || this.game.currentMap.score != null) return;
    const guess = {lat: this.game.currentGuess.position.lat(), lng: this.game.currentGuess.position.lng()};
    this.game.currentMap.guess = guess;
    this.game.setScore(guess);
    this.game.addMarkers();
  }

  onTimeEnd(){
    if(this.game.currentGuess != undefined){
      const guess = {lat: this.game.currentGuess.position.lat(), lng: this.game.currentGuess.position.lng()};
      this.game.currentMap.guess = guess;
      this.game.setScore(guess);
    }
    else {
      this.scoreBoardExpanded = true;
      this.game.setScore(null);
    }

    this.game.addMarkers();
  }
}
