import { Component, OnInit, ViewChild } from '@angular/core';
import { MapLoaderService } from '../service/map-loader.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent implements OnInit {
  @ViewChild('map') mapElement: any = null;
  polylines: any[] = [];
  name: string = '';
  map: any;
  selectedPolyline: any = null;

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

  polylinesToBorder(){

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

    google.maps.event.addListener(drawingManager, "polylinecomplete", (polyline: any) => {
      google.maps.event.addListener(polyline, "click", (e: any) => {
        if(this.selectedPolyline != null){
          this.selectedPolyline.setOptions({strokeColor: "black"})
          this.selectedPolyline = null;
        }
        else{
          this.selectedPolyline = polyline;
          this.selectedPolyline.setOptions({strokeColor: "white"});
        }

      })
      this.polylines.push(polyline);
    })
  }
}
