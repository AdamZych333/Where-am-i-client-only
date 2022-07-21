import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MapLoaderService } from '../service/map-loader.service';
import { RegionService } from '../service/region.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent implements OnInit {
  @ViewChild('map') mapElement: any = null;
  @ViewChild('removeBtn') removeBtnElement: MatButton | null = null;
  polylines: any[] = [];
  name: string = '';
  map: any;
  selectedPolyline: any = null;
  nameFormControl = new FormControl('', [Validators.required]);

  constructor(private router: Router, private regionService: RegionService, private mapLoader: MapLoaderService) { }

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
        this.addRemovePolylineBtn();
    });
  }

  getValueFromName(){
    return this.name.replace(' ', '').toLowerCase();
  }

  onSubmit(){
    if(this.nameFormControl.invalid){
      this.nameFormControl.markAsTouched();
      return;
    }
    this.regionService.addRegion(
      this.getValueFromName(),
      this.name,
      this.polylinesToBorder(),
    )
    this.router.navigate(['/']);
  }

  polylinesToBorder(){
    return this.polylines.map(e => e.getPath().getArray().map((latLng: any) => {
      return [latLng.lat(), latLng.lng()];
    }))
  }

  removeSelectedPolyline(){
    if(this.selectedPolyline == null) return;
    this.polylines = this.polylines.filter(e => e != this.selectedPolyline);
    this.selectedPolyline.setMap(null);
    this.selectedPolyline = null;
  }

  private async addRemovePolylineBtn(){
    if(this.removeBtnElement == null) return;
    this.removeBtnElement._elementRef.nativeElement.parentNode.removeChild(this.removeBtnElement?._elementRef.nativeElement);
    const controlDiv = document.createElement('div');
    controlDiv.appendChild(this.removeBtnElement._elementRef.nativeElement);
    this.map.controls[this.mapLoader.google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
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
