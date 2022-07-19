import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.sass']
})
export class TimePickerComponent implements OnInit {
  @Input() value = 180;
  @Input() max: number = 600;
  @Input() min: number = 0;
  @Input() step: number = 15;
  @Input() disabled: boolean = false;
  @Output() onValueChange = new EventEmitter<number>();

  constructor() { }


  ngOnInit(): void {
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
    for(let i = 0; i <= Math.min(59, this.max-this.value%60); i+=this.step){
      items.push(i);
    }
    return items;
  }

  onMinutesChange(event: any){
    this.value = event.value*60 + Math.floor((this.value%60)/15)*15;
    this.onValueChange.emit(this.value);
  }

  onSecondsChange(event: any){
    this.value = event.value + Math.floor(this.value/60)*60;
    this.onValueChange.emit(this.value);
  }

  getDefaultValue(){
    return {minutes: Math.floor(this.value/60), seconds: Math.floor((this.value%60)/15)*15};
  }
}
