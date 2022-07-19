export class Map{
    answer: {lat: number, lng: number};
    score: number | null = null;
    guess: {lat: number, lng: number} | null = null;
    constructor(public value: string, public viewValue: string, lat: number, lng: number){
      this.answer= {
        lat: lat,
        lng: lng
      }
    }
  
    setCoordinates(lat: number, lng: number){
      this.answer.lat = lat;
      this.answer.lng = lng;
    }
  
    hasSetCoordinates(){
      return this.answer.lat !== null && this.answer.lng !== null;
    }

    reset(){
      this.score = null;
      this.guess = null;
    }
}