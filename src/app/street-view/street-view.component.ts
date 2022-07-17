import { Component, Input, ViewChild } from '@angular/core';
import { StreetViewService } from '../service/street-view.service';

@Component({
  selector: 'app-street-view',
  templateUrl: './street-view.component.html',
  styleUrls: ['./street-view.component.sass']
})
export class StreetViewComponent {
  @ViewChild('container') containerElement: HTMLElement | null = null;
  @Input() style = {}
  
  constructor(private streetViewService: StreetViewService) { }

  ngAfterViewInit(): void {
    if(this.containerElement != null) this.streetViewService.setStreetView(this.containerElement);
  }
}
