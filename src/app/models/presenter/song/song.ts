//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**************/
/* INTERFACES */
/**************/

import { Disklikable } from '../../../interfaces/dislikable';
import { Likable } from '../../../interfaces/likable';
import { Rankable } from '../../../interfaces/rankable';
import { Ratable } from '../../../interfaces/ratable';

/**********/
/* MODELS */
/**********/

import { Album } from '../album/album';
import { Artist } from '../artist/artist';
import { Library } from '../library/library';
import { Playlist } from '../playlist/playlist';
import { Presenter } from '../presenter';

/************/
/* UTILTIES */
/************/

import { Algorithm } from '../../../utilities/algorithm';
import { Globals } from '../../../utilities/globals';
import { Settings } from '../../../utilities/settings';

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
    // private _bitrate?: number;
    // private _bpm?: number;
    // private _comments?: string;
    // private _composer?: string;
    // private _dateAdded?: Date;
    // private _dateModified?: Date;
    private _disabled?: boolean;
    // private _discCount?: number;
    // private _discNumber?: number;    // Supported by using the array index of album.tracks[discNumber][albumNumber]
    private _disliked?: boolean;
    // private _explicit?: boolean;
    private _genre?: string;
    // private _grouping?: string;
    // private _kind?: string;
    private _library?: Library;
    private _loved?: boolean;
    private _name?: string;
    private _playCount?: number;
    // private _playdate?: Date;
    private _playlists: Array<Playlist>;
    private _ranking?: number;
    private _rating?: number;
    private _ratingComputed?: boolean;
    private _releaseDate?: Date;
    // private _sampleRate?: number;
    // private _size?: number;
    private _skipCount?: number;
    // private _skipDate?: Date;
    // private _sortAlbum?: string;
    // private _sortArtist?: string;
    // private _sortComposer?: string;
    // private _sortName?: string;
    private _totalTime?: number;
    // private _trackCount?: number;
    // private _trackNumber?: number;    // Supported by using the array index of album.tracks[discNumber][albumNumber]

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(json: Object) {
        super();

        // this._bitrate = +json['Bit Rate'];
        // this._bpm = +json['BPM'];
        // this._comments = json['Comments']
        // this._composer = json['Composer']
        // this._dateAdded = json['Date Added'] ? new Date(json['Date Added']) : undefined;
        // this._dateModified = json['Date Modified'] ? new Date(json['Date Modified']) : undefined;
        this._disabled = !!(json['Disabled']);
        this._disliked = !!(json['Disliked']);
        // this._dateAdded = json['Date Added'] ? new Date(json['Date Added']) : undefined;
        // this._dateModified = json['Date Modified'] ? new Date(json['Date Modified']) : undefined;
        // this._explicit = !!(json['Explicit']);
        this._genre = json['Genre'];
        // this._grouping = json['Grouping'];
        // this._kind = json['Kind'];
        this._loved = !!(json['Loved']);
        this._name = json['Name'];
        this._playCount = +json['Play Count'] || 0;
        // this._playdate = json['Play Date UTC'] ? new Date(json['Play Date UTC']) : undefined;
        this._rating = +json['Rating'] / 20 || Globals.defaultRating;
        this._ratingComputed = !!(json['Rating Computed']);
        this._releaseDate = json['Release Date'] ? new Date(json['Release Date']) : undefined;
        // this._size = +json['Size'];
        this._skipCount = +json['Skip Count'] || 0;
        // this._skipDate = json['Skip Date'] ? new Date(json['Skip Date']) : undefined;
        this._totalTime = +json['Total Time'];

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
        if (!this._cache.has('discNumber')) {
            for (let i = 0; i < this.album.tracks.length; i++) {
                for (let j = 0; this.album.tracks[i] && j < this.album.tracks[i].length; j++) {
                    if (this.album.tracks[i][j] === this) {
                        this._cache.add('discNumber', i + 1);
                        return i + 1;
                    }
                }
            }
        }
        return this._cache.get('discNumber');
    }

    get disliked(): boolean { return this._disliked; }

    get duration(): number { return this._totalTime; }

    get genre(): string { return this._genre; }

    get library(): Library { return this._library; }
    set library(library: Library) { this._library = library; }

    get liked(): boolean { return this._loved; }

    get name(): string { return this._name; }

    get playCount(): number { return this._playCount; }

    get playlists(): Array<Playlist> { return this._playlists; }

    get releaseDate(): Date { return this._releaseDate; }

    get ranking(): number { return this._getContinuousRating(); }

    get rating(): number { return this._getDiscreteRating(); }

    get skipCount(): number { return this._skipCount; }

    get trackNumber(): number {
        if (!this._cache.has('trackNumber')) {
            for (let i = 0; i < this.album.tracks.length; i++) {
                for (let j = 0; this.album.tracks[i] && j < this.album.tracks[i].length; j++) {
                    if (this.album.tracks[i][j] === this) {
                        this._cache.add('trackNumber', j + 1);
                        return j + 1;
                    }
                }
            }
        }
        return this._cache.get('trackNumber');
    }

    get value(): number {
        let value: number = this._cache.get('value');
        if (!Number.isFinite(value)) {
            value = 0;
            if (this.isRated()) {
                const starWeights: Array<number> = this._library.getSongStarWeights();
                const starIndex: number = this._getDiscreteRating() - 1;
                const likeDislikeMultiplier: number = this._loved ? 2 : this._disliked ? 0.5 : 1;
                const playSkipMultiplier: number = 1 + this._getRelativePlaySkipRatio();
                const weightedRating: number = starWeights[starIndex];
                value = weightedRating * likeDislikeMultiplier * playSkipMultiplier;
            }
            this._cache.add('value', value);
        }
        return value;
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
        const isRankable: boolean = Settings.provideDefaultRating || !!(this._getDiscreteRating() || this._loved || this._disliked || this._playCount || this._skipCount);
        return isRankable;
    }

    public isRated(): boolean {
        return Number.isFinite(this._getDiscreteRating());
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    // ------------------------------------------------------ //
    // -------------------- PLAY METRICS -------------------- //
    // ------------------------------------------------------ //

    private _getRelativePlayRatio(): number {
        let relativePlayRatio: number = 1;

        const playRatio: number = this._playCount / this.library.getMaxPlayCount();
        if (Number.isFinite(playRatio)) {
            relativePlayRatio = playRatio;
        }

        return relativePlayRatio;
    }

    // ------------------------------------------------------ //
    // -------------------- SKIP METRICS -------------------- //
    // ------------------------------------------------------ //

    private _getRelativeSkipRatio(): number {
        let relativeSkipRatio: number = 1;

        const skipRatio: number = this._skipCount / this.library.getMaxSkipCount();
        if (Number.isFinite(skipRatio)) {
            relativeSkipRatio = skipRatio;
        }

        return relativeSkipRatio;
    }

    // ------------------------------------------------------------- //
    // -------------------- PLAY / SKIP METRICS -------------------- //
    // ------------------------------------------------------------- //

    private _getPlaySkipMultiplier(): number {
        let playSkipMultiplier: number = 1;

        if (!Settings.ignorePlays && !Settings.ignoreSkips) {
            playSkipMultiplier = 1 + this._getRelativePlaySkipRatio();
        }

        return playSkipMultiplier;
    }

    private _getAbsolutePlaySkipRatio(): number {
        const absolutePlaySkipRatio: number = this._playCount / (this._playCount + this._skipCount) || 1;
        return absolutePlaySkipRatio;
    }

    private _getAbsolutePlaySkipRating(): number {
        const absolutePlaySkipRating: number = Algorithm.scale(this._getAbsolutePlaySkipRatio(), Globals.minRating, Globals.maxRating);
        return absolutePlaySkipRating;
    }

    private _getRelativePlaySkipRatio(): number {
        let relativePlaySkipRatio: number = 0.5;

        const maxPlayCount: number = this.library.getMaxPlayCount();
        const maxSkipCount: number = this.library.getMaxSkipCount();
        const playSkipRatio: number = (this.playCount + (maxSkipCount - this.skipCount)) / (maxPlayCount + maxSkipCount);
        if (Number.isFinite(playSkipRatio)) {
            relativePlaySkipRatio = playSkipRatio;
        }

        return relativePlaySkipRatio;
    }

    private _getRelativePlaySkipRating(): number {
        const playSkipRating: number = Algorithm.scale(this._getRelativePlaySkipRatio(), Globals.minRating, Globals.maxRating);
        return playSkipRating;
    }

    // ---------------------------------------------------------------- //
    // -------------------- LIKE / DISLIKE METRICS -------------------- //
    // ---------------------------------------------------------------- //

    private _getLikeDislikeMultiplier(): number {
        let likeDislikeMultiplier: number = 1;

        if (!Settings.ignoreLikesAndDislikes) {
            if (this.isLiked()) {
                likeDislikeMultiplier = 2;
            } else if (this.isDisliked()) {
                likeDislikeMultiplier = 0.5;
            }
        }

        return likeDislikeMultiplier;
    }

    private _getLikeDislikeRating(): number {
        let likeDislikeRating: number = Globals.maxRating / 2;

        if (this.isLiked()) {
            likeDislikeRating = Globals.maxRating;
        } else if (this.isDisliked) {
            likeDislikeRating = Globals.minRating;
        }

        return likeDislikeRating;
    }

    // -------------------------------------------------------- //
    // -------------------- RATING METRICS -------------------- //
    // -------------------------------------------------------- //

    private _getDiscreteRating(): number {
        let discreteRating: number = Globals.defaultRating;

        if (Settings.ignoreComputedRatings) {
            if (this._ratingComputed) {
                discreteRating = Globals.defaultRating;
            } else {
                discreteRating = this._rating;
            }
        } else {
            discreteRating = this._rating;
        }

        return discreteRating;
    }

    private _getContinuousRating(): number {
        let continuousRating: number = this._cache.get('continuousRating')
        if (!Number.isFinite(continuousRating)) {
            continuousRating = Globals.defaultRating;
            if (this.isRated()) {
                if (this.isLiked() || this.isDisliked()) {
                    const features = [
                        { value: this._getLikeDislikeRating(), weight: 0.5 },
                        { value: this._getRelativePlaySkipRating(), weight: 0.5 }
                    ];
                    const weightedRating: number = features.reduce((sum, feature) => sum + Algorithm.applyWeight(feature.value, feature.weight), 0);
                    continuousRating =
                        (this._getDiscreteRating() - 1) + // take a star off
                        Algorithm.scale(weightedRating, Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                } else {
                    continuousRating =
                        (this._getDiscreteRating() - 1) + // take a star off
                        Algorithm.scale(this._getRelativePlaySkipRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                }
            } else {
                if (this.isLiked()) {
                    continuousRating =
                        Algorithm.scale(Globals.maxRating, Globals.minRating, (Globals.maxRating - 1) / Globals.maxRating) +
                        Algorithm.scale(this._getRelativePlaySkipRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                } else if (this.isDisliked()) {
                    continuousRating = Algorithm.scale(this._getRelativePlaySkipRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                } else {
                    continuousRating = this._getRelativePlaySkipRating();
                }
            }
            this._cache.add('continuousRating', continuousRating);
        }
        return continuousRating;
    }

    private _getRelativeRating(): number {
        let relativeRating: number = Globals.defaultRating;

        if (this.isRated()) {
            const starWeights: Array<number> = this._library.getSongStarWeights();
            let starIndex: number = this._getDiscreteRating() - 1;
            if (!Number.isInteger(starIndex)) {
                starIndex = Math.floor(starIndex);
                console.warn('Attempt to access an array with a non-integer index.');
            }
            if (starIndex < Globals.minRating || starIndex > Globals.maxRating) {
                throw new RangeError('Variable starIndex: ' + starIndex + ' is not a valid array index for starWeights: ' + starWeights.length);
            }
            relativeRating = starWeights[starIndex];
        }

        return relativeRating;
    }

} // End class Song