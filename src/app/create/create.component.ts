import { Component, OnInit, ViewChild } from '@angular/core';
import { MapLoaderService } from '../service/map-loader.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent implements OnInit {
  @ViewChild('map') mapElement: any = null;
  border: [] = [];
  name: string = '';
  map: any;
  constructor(private mapLoader: MapLoaderService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(){
    this.mapLoader.load()
      .then((google: any) => {
        if(this.mapElement == null) return
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          center: new google.maps.LatLng(0, 0),
          zoom: 2,
          clickableIcons: false
        });

        this.addDrawingManager();
    });
  }

  getValueFromName(){
    return this.name.replace(' ', '').toLowerCase();
  }

  onSubmit(){
    
  }

  private async addDrawingManager(){
    const google = await this.mapLoader.load();
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
              google.maps.drawing.OverlayType.POLYLINE,
          ],
      },
      polylineOptions: {
          editable: true
      }
    })

    drawingManager.setMap(this.map);
  }
}
