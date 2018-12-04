//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from '../classes/presenter';

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
import { Settings } from '../utilities/settings';

//////////////////
//              //
//     SONG     //
//              //
//////////////////

export class Song extends Presenter implements Rankable, Ratable, Likable, Disklikable {

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
        this._rating = (json["Rating Computed"] === "true") ? Globals.defaultRating : +json["Rating"] / 20 || Globals.defaultRating;
        this._releaseDate = json['Release Date'] ? new Date(json["Release Date"]) : null;
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
            let response = Globals.defaultRating;
            if (this.isRated()) {
                if (this.isLiked() || this.isDisliked()) {
                    const features = [
                        { value: this.getLikeDislikeRating(), weight: 0.5 },
                        { value: this.getPlaySkipRating(), weight: 0.5 }
                    ];
                    const weightedRating = features.reduce((sum, feature) => sum + Algorithm.applyWeight(feature.value, feature.weight), 0);
                    response =
                        (this._rating - 1) + // take a star off
                        Algorithm.scale(weightedRating, Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                } else {
                    response =
                        (this._rating - 1) + // take a star off
                        Algorithm.scale(this.getPlaySkipRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                }
            } else {
                if (this.isLiked()) {
                    response =
                        Algorithm.scale(Globals.maxRating, Globals.minRating, (Globals.maxRating - 1) / Globals.maxRating) +
                        Algorithm.scale(this.getPlaySkipRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                } else if (this.isDisliked()) {
                    response = Algorithm.scale(this.getPlaySkipRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                } else {
                    response = this.getPlaySkipRating();
                }
            }
            this._ranking = response;
        }
        return this._ranking;
    }

    get rating(): number { return this._rating; }

    get skipCount(): number { return this._skipCount; }

    get stars(): Array<number> {
        if (!this.cache.has('stars')) {
            const stars = Globals.rankingToStars(this.ranking);
            this.cache.add('stars', stars);;
        }
        return this.cache.get('stars');
    }

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

    get value(): number {
        if (!this.cache.has('value')) {
            let value = 0;
            if (this.isRated()) {
                const starWeights = this._library.getSongStarWeights();
                const starIndex = this._rating - 1;
                const likeDislikeMultiplier = this._liked ? 2 : this._disliked ? 0.5 : 1;
                const playSkipMultiplier = 1 + this.getPlaySkipRatio();
                const weightedRating = starWeights[starIndex];
                value = weightedRating * likeDislikeMultiplier * playSkipMultiplier;
            }
            this.cache.add('value', value);
        }
        return this.cache.get('value');
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public hasPlays(): boolean {
        return !Settings.ignorePlays && this.playCount > 0;
    }

    public isDisliked(): boolean {
        return !Settings.ignoreLikesAndDislikes && this._disliked;
    }

    public isLiked(): boolean {
        return !Settings.ignoreLikesAndDislikes && this._liked;
    }

    public isRanked(): boolean {
        return !!(this._ranking);
    }

    public isRankable(): boolean {
        const response = Settings.provideDefaultRating || !!(this._rating || this._liked || this._disliked || this._playCount || this._skipCount);
        return response;
    }

    public isRated(): boolean {
        return Number.isFinite(this._rating);
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private getWeightedRating(): number {
        let response = Globals.defaultRating;

        if (this.isRated()) {
            const starWeights = this._library.getSongStarWeights();
            let starIndex = this._rating - 1;
            if (!Number.isInteger(starIndex)) {
                starIndex = Math.floor(this._rating) - 1;
                console.warn('Attempt to access an array with a non-integer index.');
            }
            if (starIndex < Globals.minRating || starIndex > Globals.maxRating) {
                throw new RangeError("Variable starIndex is not a valid array index.");
            }
            response = starWeights[starIndex];
        }

        return response;
    }

    private getPlaySkipRatio(): number {
        let response = 0.5;

        const maxPlayCount = this.library.getMaxPlayCount();
        const maxSkipCount = this.library.getMaxSkipCount();
        const playSkipRatio = (this.playCount + (maxSkipCount - this.skipCount)) / (maxPlayCount + maxSkipCount);
        if (Number.isFinite(playSkipRatio)) { response = playSkipRatio; }

        return response;
    }

    private getPlaySkipRating(): number {
        const playSkipRating = Algorithm.scale(this.getPlaySkipRatio(), Globals.minRating, Globals.maxRating);
        return playSkipRating;
    }

    private getPlayRatio(): number {
        let response = 1;

        const playRatio = this._playCount / this.library.getMaxPlayCount();
        if (Number.isFinite(playRatio)) { response = playRatio; }

        return response;
    }

    private getSkipRatio(): number {
        let response = 1;

        const skipRatio = this._skipCount / this.library.getMaxSkipCount();
        if (Number.isFinite(skipRatio)) { response = skipRatio; }

        return response;
    }

    private getAbsolutePlaySkipRating(): number {
        const playSkipRatio = this._playCount - this._skipCount;
        const playSkipRating = Algorithm.scale(playSkipRatio, Globals.minRating, Globals.maxRating);
        return playSkipRating;
    }

    private getRelativePlaySkipRating(): number {
        const maxPlayCount = this.library.getMaxPlayCount();
        const maxSkipCount = this.library.getMaxSkipCount();
        let relativePlaySkipRatio = (this.playCount + (maxSkipCount - this.skipCount)) / (maxPlayCount + maxSkipCount);
        relativePlaySkipRatio = relativePlaySkipRatio || 0; // Handle Divide by Zero Error
        const relativePlaySkipRating = Algorithm.scale(relativePlaySkipRatio, Globals.minRating, Globals.maxRating);
        return relativePlaySkipRating;
    }

    private getLikeDislikeRating(): number {
        let response = Globals.maxRating / 2;

        if (this.isLiked()) {
            response = Globals.maxRating;
        } else if (this.isDisliked) {
            response = Globals.minRating;
        }

        return response;
    }

} // End class Song