import { Injectable } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MapLoaderService } from './map-loader.service';

@Injectable({
  providedIn: 'root'
})
export class StreetViewService {
  panorama: any;

  constructor(private mapLoader: MapLoaderService) { }

  async setStreetView(panoramaElement: any, resetBtn: any, answer: {lat: number, lng: number}, settings: {rotation: boolean, zooming: boolean, moving: boolean}){
    await this.mapLoader.load();
    this.panorama = new this.mapLoader.google.maps.StreetViewPanorama(panoramaElement.nativeElement, {
      position: new this.mapLoader.google.maps.LatLng(answer),
      zoom: 0,
      pov: { heading: 0, pitch: 0 },
      showRoadLabels: false,
      fullscreenControl: false,
      zoomControl: settings.zooming,
      scrollwheel: settings.zooming,
      panControl: settings.rotation,
      linksControl: settings.moving,
      clickToGo: settings.moving,
      visible: false
    })

    const controlDiv = document.createElement('div');
    controlDiv.appendChild(resetBtn);
    this.panorama.controls[this.mapLoader.google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
  }

  setPanoramaPosition(position: {lat: number, lng: number}){
    this.panorama.setPosition(position);
  }

  makeVisible(){
    if(this.panorama != undefined) this.panorama.setVisible(true);
  }

  makeNotVisible(){
    if(this.panorama != undefined) this.panorama.setVisible(false);
  }

  // private addResetBtn(action: () => void){
  //   const controlDiv = document.createElement('div');
  //   const resetBtn = document.createElement('div');
  //   resetBtn.style.width = '50px';
  //   resetBtn.style.height = '50px';
  //   resetBtn.style.margin = '15px 10px';
  //   resetBtn.style.borderRadius = '3px';
  //   resetBtn.style.backgroundColor = 'hsla(0, 0%, 15%, 1)';
  //   resetBtn.style.cursor = 'pointer';
  //   resetBtn.style.textAlign = 'center';
  //   resetBtn.title = 'Reset';
  //   controlDiv.appendChild(resetBtn);

  //   const controlText = document.createElement("div");

  //   controlText.style.color = "hsla(0, 0%, 80%, 1)";
  //   controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  //   controlText.style.fontSize = "13px";
  //   controlText.style.lineHeight = "38px";
  //   controlText.style.paddingTop = "5px";
  //   controlText.style.paddingLeft = "5px";
  //   controlText.style.paddingRight = "5px";
  //   controlText.innerHTML = 'Reset';
  //   resetBtn.appendChild(controlText);

  //   resetBtn.addEventListener('click', action);

  //   this.panorama.controls[this.mapLoader.google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
  // }
}
