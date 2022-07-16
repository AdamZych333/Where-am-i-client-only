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
  google: any;
  private static promise: Promise<void>;

  constructor() { }

  public load(): Promise<any> {
    if (!MapLoaderService.promise) { // load once
      MapLoaderService.promise = new Promise((resolve) => {
        window['__onGapiLoaded'] = () => {
          console.log('google maps api loaded')
          this.google = window.google;
          resolve(this.google);
          delete window['__onGapiLoaded'];
        }
        console.log('loading google maps api..')
        const node = document.createElement('script');
        const API = 'AIzaSyCKM_0UDe1T4N934koVftvEtmSn8I_l7Hw';
        node.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=__onGapiLoaded&libraries=drawing,geometry`;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);
      });
    }
    return MapLoaderService.promise;
  }
}
