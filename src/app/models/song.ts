import { Artist } from './artist';
import { Album } from './album';

export class Song {
    public name: string;
    
    public artist: Artist;
    public album: Album;

    public genre: string;

    public duration: number;
    public releaseDate: Date;

    public rating: number;
    public playCount: number;
    public skipCount: number;

    public trackID: number;
    public trackNumber: number;
    public discNumber: number;

    public constructor(init?: Partial<Song>) {
        Object.assign(this, init);
    }

    public GetRating(): number {
        return this.rating > 0 ? this.rating / 20 : 0;
    }
}