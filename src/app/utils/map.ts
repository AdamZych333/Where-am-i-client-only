export class Map{
    lat: number | null = null;
    lng: number | null = null;
    seed: number = 0;
    score: number | null = null;
    guess: {lat: number, lng: number} | null = null;
    constructor(public value: string, public viewValue: string){}
  
    setCoordinates(lat: number, lng: number){
      this.lat = lat;
      this.lng = lng;
    }
  
    hasSetCoordinates(){
      return this.lat !== null && this.lng !== null;
    }
}