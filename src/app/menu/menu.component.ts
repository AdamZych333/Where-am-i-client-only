import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
  returnValue: {
    time: number,
    next: boolean,
    prev: boolean
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.returnValue = {
      time: data.time,
      next: false,
      prev: false,
    };
  }

  ngOnInit(): void {
  }

  getTitle(){
    return this.data.title;
  }

  getTime(){
    return this.returnValue.time;
  }

  getRoundNumber(){
    return this.data.mapNumber;
  }

  changeTime(newTime: number){
    this.returnValue.time = newTime;
  }

  onStartClick(){
    return this.returnValue;
  }

  onPrevClick(){
    return {...this.returnValue, prev: true};
  }

  onNextClick(){
    return {...this.returnValue, next: true};
  }
}
