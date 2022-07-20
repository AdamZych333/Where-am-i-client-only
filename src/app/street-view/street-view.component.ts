import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { GameService } from '../service/game.service';
import { StreetViewService } from '../service/street-view.service';

@Component({
  selector: 'app-street-view',
  templateUrl: './street-view.component.html',
  styleUrls: ['./street-view.component.sass']
})
export class StreetViewComponent {
  @ViewChild('container') containerElement: HTMLElement | null = null;
  @ViewChild('resetBtn') resetBtnElement: MatButton | null = null;
  @Input() style = {};
  @Output() afterInit = new EventEmitter<void>();
  
  constructor(private game: GameService, private streetView: StreetViewService) { }

  ngAfterViewInit(): void {
    this.resetBtnElement?._elementRef.nativeElement.parentNode.removeChild(this.resetBtnElement?._elementRef.nativeElement);

    this.game.generateMap().then(() => {
      if(this.containerElement != null) this.streetView.setStreetView(
        this.containerElement, 
        this.resetBtnElement?._elementRef.nativeElement,
        this.game.currentMap.answer,
        {
          rotation: !this.game.params.noRotation,
          zooming: !this.game.params.noZoom,
          moving: !this.game.params.noMoving,
        }
        );
    })
    this.afterInit.emit();
  }

  getRotation(){
    return this.game.params.noRotation? 'none': '';
  }

  onResetClick(){
    this.game.resetSVPosition();
  }
}