import { Injectable } from '@angular/core';
import { Map } from '../utils/map';
import { Region, regions } from '../utils/region';
import { MapLoaderService } from './map-loader.service';
import { RandomStreetviewService } from './random-streetview.service';

@Injectable()
export class GameService {
  params: {
    seed: string,
    region: Region,
    timer: number,
  }
  panorama: any;
  maps: Map[] = [];
  currentMap: Map = this.maps[0];

  constructor(private randomStreetView: RandomStreetviewService, private mapLoader: MapLoaderService ) {
    this.params = {
      seed: '',
      region: regions[0],
      timer: 180,
    }
   }

   setParameters(seed: string, region = this.params.region, timer = this.params.timer){
    this.params.seed = seed;
    this.params.region = region;
    this.params.timer = timer;
   }

   async generateMap(){
    this.randomStreetView.setParameters({
      border: this.params.region.border,
      seed: this.params.seed,
      google: await this.mapLoader.load()
    })
    const location = await this.randomStreetView.getRandomLocation();
    const index = (this.maps.length+1).toString()
    this.currentMap = new Map(index, index, location[0], location[1]);
    this.maps.push(this.currentMap);
   }

   async setStreetView(panoramaElement: any){
    await this.mapLoader.load();
    this.panorama = new this.mapLoader.google.maps.StreetViewPanorama(panoramaElement.nativeElement, {
      position: new this.mapLoader.google.maps.LatLng(this.currentMap.answer),
      zoom: 1,
      pov: { heading: 0, pitch: 0 },
      showRoadLabels: false,
    })
  }

  async updateStreetViewPosition(position: {lat: number, lng: number}){
    this.panorama.setPosition(position);
  }
}
