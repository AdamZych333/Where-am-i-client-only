import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.sass']
})
export class TimePickerComponent implements OnInit {
  @Input() value: {minutes: number, seconds: number} = {
    minutes: 0,
    seconds: 0
  };
  @Input() max: number = 600;
  @Input() min: number = 0;
  @Input() step: number = 15;
  @Input() disabled: boolean = false;
  timerValue = {
    minutes: 0, 
    seconds: 0
  };

  constructor() { }


  ngOnInit(): void {
    this.timerValue.minutes = this.value.minutes;
    this.timerValue.seconds = this.value.seconds;
  }

  getSelectMinutes(){
    const items: number[] = []
    for(let i = Math.floor(this.min/60); i < Math.floor(this.max/60); i++){
      items.push(i);
    }
    return items;
  }

  getSelectSeconds(){
    const items: number[] = []
    for(let i = 0; i <= Math.min(59, this.max-this.value.minutes*60); i+=this.step){
      items.push(i);
    }
    return items;
  }

  onMinutesChange(event: any){
    this.value.minutes = event.value;
  }

  onSecondsChange(event: any){
    this.value.seconds = event.value;
  }

  getDefaultValue(){
    return {minutes: this.value.minutes, seconds: this.value.seconds};
  }
}
