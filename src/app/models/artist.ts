import { Album } from './album';

export class Artist {
    public name: string;
    public albums: Object;

    constructor(name: string) {
        this.name = name;
        this.albums = new Object();
    }
}