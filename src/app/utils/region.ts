export class Region{
    constructor(public value: string, public viewValue: string, public border: []){}
}

export const regions: Region[] = [
    new Region('world', 'The World', []),
  ]