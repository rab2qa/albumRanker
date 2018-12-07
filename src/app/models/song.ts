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
    private _disabled?: boolean;
    private _disliked?: boolean;
    private _duration: number;
    private _explicit?: boolean;
    private _genre?: string;
    private _library?: Library;
    private _loved?: boolean;
    private _name: string;
    private _playCount: number;
    private _playlists: Array<Playlist>;
    private _ranking?: number;
    private _rating: number;
    private _ratingComputed?: boolean;
    private _releaseDate?: Date;
    private _skipCount: number;


    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(json: Object) {
        super();

        this._disabled = (json["Disabled"] === "true");
        this._disliked = (json["Disliked"] === "true");
        this._duration = +json["Total Time"];
        this._explicit = (json["Explicit"] === "true");
        this._genre = json["Genre"];
        this._loved = (json["Loved"] === "true");
        this._name = json["Name"];
        this._playCount = +json["Play Count"] || 0;
        this._rating = +json["Rating"] / 20 || Globals.defaultRating;
        this._ratingComputed = (json["Rating Computed"] === "true");
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

    get checked(): boolean { return !this._disabled; }

    get discNumber(): number {
        if (!this.cache.has('discNumber')) {
            for (let i = 0; i < this.album.tracks.length; i++) {
                for (let j = 0; this.album.tracks[i] && j < this.album.tracks[i].length; j++) {
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

    get explicit(): boolean { return this._explicit; }

    get genre(): string { return this._genre; }

    get library(): Library { return this._library; }
    set library(library: Library) { this._library = library; }

    get liked(): boolean { return this._loved; }

    get name(): string { return this._name; }

    get playCount(): number { return this._playCount; }

    get playlists(): Array<Playlist> { return this._playlists; }

    get releaseDate(): Date { return this._releaseDate; }

    get ranking(): number { return this.getContinuousRating(); }

    get rating(): number { return this.getDiscreteRating(); }

    get skipCount(): number { return this._skipCount; }

    get trackNumber(): number {
        if (!this.cache.has('trackNumber')) {
            for (let i = 0; i < this.album.tracks.length; i++) {
                for (let j = 0; this.album.tracks[i] && j < this.album.tracks[i].length; j++) {
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
                const starIndex = this.getDiscreteRating() - 1;
                const likeDislikeMultiplier = this._loved ? 2 : this._disliked ? 0.5 : 1;
                const playSkipMultiplier = 1 + this.getRelativePlaySkipRatio();
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
        return !Settings.ignoreLikesAndDislikes && this._loved;
    }

    public isRanked(): boolean {
        return !!(this._ranking);
    }

    public isRankable(): boolean {
        const response = Settings.provideDefaultRating || !!(this.getDiscreteRating() || this._loved || this._disliked || this._playCount || this._skipCount);
        return response;
    }

    public isRated(): boolean {
        return Number.isFinite(this.getDiscreteRating());
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    // -------------------- PLAY METRICS -------------------- //

    private getRelativePlayRatio(): number {
        let response = 1;

        const playRatio = this._playCount / this.library.getMaxPlayCount();
        if (Number.isFinite(playRatio)) { 
            response = playRatio; 
        }

        return response;
    }

    // -------------------- SKIP METRICS -------------------- //

    private getRelativeSkipRatio(): number {
        let response = 1;

        const skipRatio = this._skipCount / this.library.getMaxSkipCount();
        if (Number.isFinite(skipRatio)) { 
            response = skipRatio; 
        }

        return response;
    }

    // -------------------- PLAY / SKIP METRICS -------------------- //

    private getPlaySkipMultiplier(): number {
        let response = 1;

        if (!Settings.ignorePlays && !Settings.ignoreSkips) {
            response = 1 + this.getRelativePlaySkipRatio();
        }

        return response;
    }

    private getAbsolutePlaySkipRatio(): number {
        let response = 1;

        const absolutePlaySkipRatio = this._playCount / (this._playCount + this._skipCount);
        if (Number.isFinite(absolutePlaySkipRatio)) {
            response = absolutePlaySkipRatio;
        }

        return response;
    }

    private getAbsolutePlaySkipRating(): number {
        const absolutePlaySkipRating = Algorithm.scale(this.getAbsolutePlaySkipRatio(), Globals.minRating, Globals.maxRating);
        return absolutePlaySkipRating;
    }

    private getRelativePlaySkipRatio(): number {
        let response = 0.5;

        const maxPlayCount = this.library.getMaxPlayCount();
        const maxSkipCount = this.library.getMaxSkipCount();
        const playSkipRatio = (this.playCount + (maxSkipCount - this.skipCount)) / (maxPlayCount + maxSkipCount);
        if (Number.isFinite(playSkipRatio)) {
            response = playSkipRatio;
        }

        return response;
    }

    private getRelativePlaySkipRating(): number {
        const playSkipRating = Algorithm.scale(this.getRelativePlaySkipRatio(), Globals.minRating, Globals.maxRating);
        return playSkipRating;
    }

    // -------------------- LIKE / DISLIKE METRICS -------------------- //

    private getLikeDislikeMultiplier(): number {
        let response = 1;

        if (!Settings.ignoreLikesAndDislikes) {
            if (this.isLiked()) {
                response = 2;
            } else if (this.isDisliked()) {
                response = 0.5;
            }
        }

        return response;
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

    // -------------------- RATING METRICS -------------------- //

    private getDiscreteRating(): number {
        let response = Globals.defaultRating;

        if (Settings.ignoreComputedRatings) {
            if (this._ratingComputed) {
                response = Globals.defaultRating;
            } else {
                response = this._rating;
            }
        } else {
            response = this._rating;
        }

        return response;
    }

    private getContinuousRating(): number {
        if (!this.cache.has('continuousRating')) {
            let continuousRating = Globals.defaultRating;
            if (this.isRated()) {
                if (this.isLiked() || this.isDisliked()) {
                    const features = [
                        { value: this.getLikeDislikeRating(), weight: 0.5 },
                        { value: this.getRelativePlaySkipRating(), weight: 0.5 }
                    ];
                    const weightedRating = features.reduce((sum, feature) => sum + Algorithm.applyWeight(feature.value, feature.weight), 0);
                    continuousRating =
                        (this.getDiscreteRating() - 1) + // take a star off
                        Algorithm.scale(weightedRating, Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                } else {
                    continuousRating =
                        (this.getDiscreteRating() - 1) + // take a star off
                        Algorithm.scale(this.getRelativePlaySkipRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                }
            } else {
                if (this.isLiked()) {
                    continuousRating =
                        Algorithm.scale(Globals.maxRating, Globals.minRating, (Globals.maxRating - 1) / Globals.maxRating) +
                        Algorithm.scale(this.getRelativePlaySkipRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                } else if (this.isDisliked()) {
                    continuousRating = Algorithm.scale(this.getRelativePlaySkipRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                } else {
                    continuousRating = this.getRelativePlaySkipRating();
                }
            }
            this.cache.add('continuousRating', continuousRating);
        }
        return this.cache.get('continuousRating');
    }

    private getRelativeRating(): number {
        let response = Globals.defaultRating;

        if (this.isRated()) {
            const starWeights = this._library.getSongStarWeights();
            let starIndex = this.getDiscreteRating() - 1;
            if (!Number.isInteger(starIndex)) {
                starIndex = Math.floor(starIndex);
                console.warn('Attempt to access an array with a non-integer index.');
            }
            if (starIndex < Globals.minRating || starIndex > Globals.maxRating) {
                throw new RangeError("Variable starIndex: " + starIndex + " is not a valid array index for starWeights: " + starWeights.length);
            }
            response = starWeights[starIndex];
        }

        return response;
    }

} // End class Song