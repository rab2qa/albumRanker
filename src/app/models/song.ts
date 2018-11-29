//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Multimedia } from '../classes/multimedia';

/**************/
/* INTERFACES */
/**************/

import { Disklikable } from '../interfaces/dislikable';
import { Likable } from '../interfaces/likable';
import { Rankable } from '../interfaces/rankable';
import { Ratable } from '../interfaces/ratable';

/**********/
/* MODELS */
/**********/

import { Album } from './album';
import { Artist } from './artist';
import { Library } from './library';
import { Playlist } from './playlist';

/************/
/* UTILTIES */
/************/

import { Algorithm } from '../utilities/algorithm';
import { Globals } from '../utilities/globals';

//////////////////
//              //
//     SONG     //
//              //
//////////////////

export class Song extends Multimedia implements Rankable, Ratable, Likable, Disklikable {

    /**************/
    /* PROPERTIES */
    /**************/

    private _album?: Album;
    private _artist?: Artist;
    private _disliked: boolean;
    private _duration: number;
    private _genre: string;
    private _library?: Library;
    private _liked: boolean;
    private _name: string;
    private _playCount: number;
    private _playlists: Array<Playlist>;
    private _ranking?: number;
    private _rating: number;
    private _releaseDate: Date;
    private _skipCount: number;


    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(json: Object) {
        super();

        this._disliked = json["Disliked"] === "true";
        this._duration = +json["Total Time"];
        this._genre = json["Genre"];
        this._liked = json["Loved"] === "true";
        this._name = json["Name"];
        this._playCount = +json["Play Count"] || 0;
        this._rating = +json["Rating"] / 20 || 0;
        this._releaseDate = new Date(json["Release Date"]);
        this._skipCount = +json["Skip Count"] || 0;

        this._playlists = new Array<Playlist>();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get album(): Album { return this._album; }
    set album(album: Album) { this._album = album; }

    get artist(): Artist { return this._artist; }
    set artist(artist: Artist) { this._artist = artist; }

    get discNumber(): number {
        if (!this.cache.has('discNumber')) {
            for (let i = 0; i < this.album.tracks.length; i++) {
                for (let j = 0; j < this.album.tracks[i].length; j++) {
                    if (this.album.tracks[i][j] === this) {
                        this.cache.add('discNumber', i + 1);
                        return i + 1;
                    }
                }
            }
        }
        return this.cache.get('discNumber');
    }

    get disliked(): boolean { return this._disliked; }

    get duration(): number { return this._duration; }

    get genre(): string { return this._genre; }

    get library(): Library { return this._library; }
    set library(library: Library) { this._library = library; }

    get liked(): boolean { return this._liked; }

    get name(): string { return this._name; }

    get playCount(): number { return this._playCount; }

    get playlists(): Array<Playlist> { return this._playlists; }

    get releaseDate(): Date { return this._releaseDate; }

    get ranking(): number {
        if (!this._ranking) {
            const maxPlayCount = this.library.getMaxPlayCount();
            const maxSkipCount = this.library.getMaxSkipCount();
            let likeDislikeRating = (this.liked) ? 5 : (this.disliked) ? 0 : null;
            let playSkipRatio = (this.playCount + (maxSkipCount - this.skipCount)) / (maxPlayCount + maxSkipCount);
            playSkipRatio = playSkipRatio || 0; // Handle Divide by Zero Error
            const playSkipRating = Algorithm.scale(playSkipRatio, Globals.minRating, Globals.maxRating);

            let result = 0;

            if (this.rating || this.liked || this.disliked || this.playCount || this.skipCount) {
                if (this.rating) {
                    if (this.liked || this.disliked) {
                        const featureWeights = { likeDislikeRating: 0.5, playSkipRating: 0.5 };
                        const weightedRating =
                            Algorithm.applyWeight(likeDislikeRating, featureWeights.likeDislikeRating) +
                            Algorithm.applyWeight(playSkipRating, featureWeights.playSkipRating);
                        result =
                            (this.rating - 1) + // take a star off
                            Algorithm.scale(weightedRating, Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                    } else {
                        result =
                            (this.rating - 1) + // take a star off
                            Algorithm.scale(playSkipRating, Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                    }
                } else {
                    if (this.liked) {
                        result =
                            Algorithm.scale(Globals.maxRating, Globals.minRating, (Globals.maxRating - 1) / Globals.maxRating) +
                            Algorithm.scale(playSkipRating, Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                    } else if (this.disliked) {
                        result = Algorithm.scale(playSkipRating, Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                    } else {
                        result = playSkipRating;
                    }
                }
            }

            // Update the Model
            this._ranking = result;
        }

        return this._ranking;
    }

    get rating(): number { return this._rating; }

    get skipCount(): number { return this._skipCount; }

    get trackNumber(): number {
        if (!this.cache.has('trackNumber')) {
            for (let i = 0; i < this.album.tracks.length; i++) {
                for (let j = 0; j < this.album.tracks[i].length; j++) {
                    if (this.album.tracks[i][j] === this) {
                        this.cache.add('trackNumber', j + 1);
                        return j + 1;
                    }
                }
            }
        }
        return this.cache.get('trackNumber');
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isRanked(): boolean {
        return !!(this.ranking);
    }

    public isRated(): boolean {
        return !!(this.rating);
    }

} // End class Song