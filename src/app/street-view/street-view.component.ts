import { Component, Input, ViewChild } from '@angular/core';
import { GameService } from '../service/game.service';
import { StreetViewService } from '../service/street-view.service';

@Component({
  selector: 'app-street-view',
  templateUrl: './street-view.component.html',
  styleUrls: ['./street-view.component.sass']
})
export class StreetViewComponent {
  @ViewChild('container') containerElement: HTMLElement | null = null;
  @Input() style = {}
  
  constructor(private game: GameService) { }

  ngAfterViewInit(): void {
    this.game.generateMap().then(() => {
      if(this.containerElement != null) this.game.setStreetView(this.containerElement);
    })
  }
}
