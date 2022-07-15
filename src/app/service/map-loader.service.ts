import { Injectable } from '@angular/core';

declare const window: any;

export interface Settings{
  lat: number,
  lng: number,
  zoom: number,
}

@Injectable({
  providedIn: 'root'
})
export class MapLoaderService {

  constructor() { }

  private static promise: Promise<void>;

  public load() {
    if (!MapLoaderService.promise) { // load once
      MapLoaderService.promise = new Promise((resolve) => {
        window['__onGapiLoaded'] = () => {
          console.log('google maps api loaded')
          resolve();
          delete window['__onGapiLoaded'];
        }
        console.log('loading google maps api..')
        const node = document.createElement('script');
        const API = 'AIzaSyCKM_0UDe1T4N934koVftvEtmSn8I_l7Hw';
        node.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=__onGapiLoaded&libraries=drawing`;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);
      });
    }

    return MapLoaderService.promise;
  }

  public async initMap(mapElement: any, settings: Settings){
    await this.load()
    return new window.google.maps.Map(mapElement.nativeElement, {
      center: new window.google.maps.LatLng(settings.lat, settings.lng),
      zoom: settings.zoom,
    })
    
  }

  public async initStreetView(panorama: any, settings: Settings){
    await this.load();

    return new window.google.maps.StreetViewPanorama(panorama.nativeElement, {
      position: new window.google.maps.LatLng(settings.lat, settings.lng),
      zoom: settings.zoom,
      pov: { heading: 0, pitch: 0 },
    })
  }
}
