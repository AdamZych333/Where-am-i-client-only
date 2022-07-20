import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuComponent } from '../menu/menu.component';
import { GameService } from '../service/game.service';
import { GoogleMapService } from '../service/google-map.service';

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

  constructor(private googleMaps: GoogleMapService, private dialog: MatDialog, private game: GameService, private sanitizer: DomSanitizer) {
    this.timeLeft = game.params.timer;
  }
  ngOnInit(): void {
    if(this.game.isCurrentMapFinnished()){
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
    const dialogRef = this.dialog.open(MenuComponent, {
      data: {
        title: this.game.params.region.viewValue,
        time: this.game.params.timer
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
      if(this.timeLeft == 0) return;
        this.startTimer();
    })
  }

  getIsGameFinnished(){
    return this.game.isCurrentMapFinnished();
  }

  getTimerValue(){
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
    if(this.googleMaps.currentGuess == undefined || this.game.isCurrentMapFinnished()) return;
    const guess = {lat: this.googleMaps.currentGuess.position.lat(), lng: this.googleMaps.currentGuess.position.lng()};
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
    if(this.game.isCurrentMapFinnished()){
      this.scoreBoardExpanded = true; 
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
      const guess = {lat: this.googleMaps.currentGuess.position.lat(), lng: this.googleMaps.currentGuess.position.lng()};
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
