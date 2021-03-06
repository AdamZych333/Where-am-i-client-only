import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuComponent } from '../menu/menu.component';
import { GameService } from '../service/game.service';
import { GoogleMapService } from '../service/google-map.service';
import { StreetViewService } from '../service/street-view.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit {
  timeLeft: number;
  timer: any;
  scoreBoardExpanded = false;
  showScoreBoard = false;

  @HostBinding("attr.style")
  public get panoramaWidth(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`--panorama-width: ${this.getStreetViewStyle().width}`);
  }

  constructor(private streetView: StreetViewService, private googleMaps: GoogleMapService, private dialog: MatDialog, private game: GameService, private sanitizer: DomSanitizer) {
    this.timeLeft = game.params.timer;
  }
  ngOnInit(): void {
    
  }

  afterSvInit(){
    if(this.game.isMapFinnished(this.game.currentMap)){
      this.scoreBoardExpanded = true;
      return;
    }
    this.showDialog();
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

  showDialog(){
    this.streetView.makeNotVisible();
    this.showScoreBoard = false;
    const dialogRef = this.dialog.open(MenuComponent, {
      data: {
        title: this.game.params.region.viewValue,
        time: this.game.params.timer,
        mapNumber: this.game.maps.indexOf(this.game.currentMap)+1,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == undefined) return;
      if(result.prev) {
        this.onPrevClick();
        return;
      }
      if(result.next) {
        this.onNextClick();
        return;
      }
      this.game.params.timer = result.time;
      this.timeLeft = result.time;
      document.documentElement.scrollTop = document.documentElement.scrollHeight;
      this.streetView.makeVisible();
      this.showScoreBoard = true;
      if(this.timeLeft == 0) return;
        this.startTimer();
    })
  }

  getIsGameFinnished(){
    return this.game.isMapFinnished(this.game.currentMap);
  }

  getTimerValue(){
    if(this.game.currentMap != undefined && this.game.currentMap.guess != null) return {minutes: Math.floor(this.game.currentMap.guess.timeLeft/60), seconds: this.game.currentMap.guess.timeLeft%60};
    if(this.game.isMapFinnished(this.game.currentMap)) return {minutes: 0, seconds: 0};
    return {minutes: Math.floor(this.timeLeft/60), seconds: this.timeLeft%60};
  }

  getScore(){
    if(this.game.currentMap == undefined)
      return 0;
    return this.game.currentMap.score == null? 0: this.game.currentMap.score;
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

  onScoreBoardClick(){
    this.scoreBoardExpanded = !this.scoreBoardExpanded;
  }

  onSubmitClick(){
    if(this.googleMaps.currentGuess == undefined || this.game.isMapFinnished(this.game.currentMap)) return;
    const guess = {
      lat: this.googleMaps.currentGuess.position.lat(), 
      lng: this.googleMaps.currentGuess.position.lng(),
      timeLeft: this.timeLeft,
    };
    this.game.currentMap.guess = guess;
    this.stopTimer();
    this.game.setScore(guess);
    this.googleMaps.addMarkers(this.game.currentMap);
  }

  onPrevClick(){
    this.game.setToPreviousMap();
    this.mapChange();
  }

  async onNextClick(){
    await this.game.setToNextMap();
    this.mapChange();
  }

  mapChange(){
    if(this.game.isMapFinnished(this.game.currentMap)){
      this.scoreBoardExpanded = true;
      this.streetView.makeVisible();
      this.googleMaps.addMarkers(this.game.currentMap);
    }
    else{
      this.scoreBoardExpanded = false;
      this.googleMaps.reset();
      this.showDialog();
    }
    
  }

  onTimeEnd(){
    if(this.googleMaps.currentGuess != undefined){
      const guess = {
        lat: this.googleMaps.currentGuess.position.lat(), 
        lng: this.googleMaps.currentGuess.position.lng(),
        timeLeft: this.timeLeft,
      };
      this.game.currentMap.guess = guess;
      this.game.setScore(guess);
    }
    else {
      this.scoreBoardExpanded = true;
      this.game.setScore(null);
    }

    this.googleMaps.addMarkers(this.game.currentMap);
  }
}
